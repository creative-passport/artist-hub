/*
* SPDX-FileCopyrightText: 2021 Mahtab Ghamsari <mahtab@creativepassport.net>
*
* SPDX-License-Identifier: AGPL-3.0-only
*/

import crypto from 'crypto';
import { splitFirst } from '../lib/splitFirst';
import { RequestWithRawBody } from '../types';
import { DateTime } from 'luxon';
import { APActor } from '../models/APActor';
import { getActor } from './actor';

const sigRegex = /^(.+)="(.*)"$/;

const requiredHeaders = ['(request-target)', 'date', 'digest'];
const supportedAlgorithms = ['rsa-sha256', 'hs2019'];
const clockSkew = 1800;

async function actorFromKeyId(keyId: string): Promise<APActor | undefined> {
  if (keyId.startsWith('acct:')) {
    throw new Error('webfinger key ID not supported');
  }
  const [uri] = keyId.split('#');
  const actor = await getActor(uri);
  return actor;
}

/**
 * Verifies the HTTP signature for an HTTP request and gets the actor that
 * signed the request
 *
 * @param req - The express request with the raw HTTP body
 * @returns The verified actor
 */
export async function verifiedActorFromSignature(
  req: RequestWithRawBody
): Promise<APActor> {
  if (!req.headers.signature || typeof req.headers.signature !== 'string') {
    throw new Error('No Signature header');
  }

  let keyId: string | undefined;
  let sigHeaders: string[] | undefined;
  let signature: string | undefined;
  for (const p of req.headers.signature.split(',')) {
    const match = p.match(sigRegex);
    if (match) {
      switch (match[1]) {
        case 'keyId':
          keyId = match[2];
          break;
        case 'headers':
          sigHeaders = match[2].split(' ').map((h) => h.toLowerCase());
          break;
        case 'signature':
          signature = match[2];
          break;
        case 'algorithm':
          if (!supportedAlgorithms.includes(match[2])) {
            throw new Error(`Unsupported algorithm ${match[2]}`);
          }
      }
    }
  }
  if (!keyId || !sigHeaders || !signature) {
    throw new Error(`Unable to parse signature ${req.headers.signature}`);
  }
  const actor = await actorFromKeyId(keyId);
  if (!actor) {
    throw new Error('Actor not found from keyId');
  }

  for (const r of requiredHeaders) {
    if (!sigHeaders.includes(r)) {
      throw new Error(
        `Required parameter ${r} missing from signature: ${req.headers.signature}`
      );
    }
  }

  if (!req.headers.date) {
    throw new Error('Date header missing');
  }

  // Ensure the date is within the allowed clock skew
  const date = DateTime.fromHTTP(req.headers.date);
  if (Math.abs(date.diffNow('seconds').seconds) > clockSkew) {
    throw new Error(`Date header invalid ${req.headers.date}`);
  }

  // Verify the signature
  const verify = crypto.createVerify('sha256');

  sigHeaders.forEach((h, i) => {
    if (i !== 0) {
      verify.write('\n');
    }
    let val: string | string[] | undefined;
    switch (h) {
      case '(request-target)':
        val = `post ${req.originalUrl}`;
        break;
      case 'host':
        val = req.hostname;
        break;
      default:
        val = req.headers[h];
        break;
    }
    if (typeof val !== 'string') {
      return false;
    }
    verify.update(`${h}: ${val}`);
  });
  verify.end();
  if (!verify.verify(actor.publicKey, signature, 'base64')) {
    throw new Error('Signature verification failed');
  }
  if (!req.headers.digest || typeof req.headers.digest !== 'string') {
    throw new Error('Digest header not present');
  }

  // Check the digest
  const digests = req.headers.digest
    .split(',')
    .map((d) => splitFirst(d, '='))
    .map(([k, v]) => [k.toLowerCase(), v]);

  const sha256Digest = digests.find((d) => d[0] === 'sha-256');
  if (!sha256Digest) {
    // We only support sha-256 digest
    throw new Error(
      `Digest header doesn't include sha-256 ${req.headers.digest}`
    );
  }
  const bodyHash = crypto
    .createHash('sha256')
    .update(req.rawBody)
    .digest('base64');
  if (bodyHash !== sha256Digest[1]) {
    throw new Error(`Digest doesn't match ${bodyHash} !== ${sha256Digest[1]}`);
  }
  return actor;
}
