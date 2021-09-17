/*
* SPDX-FileCopyrightText: 2021 Mahtab Ghamsari <mahtab@creativepassport.net>
*
* SPDX-License-Identifier: AGPL-3.0-only
*/

import http from 'http';
import https from 'https';
import { URL } from 'url';
import crypto from 'crypto';
import { APActor } from '../models/APActor';

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

const timeout = 10000;
const algorithm = 'rsa-sha256';

function signSha256(data: string, privateKey: string): string {
  const signer = crypto.createSign('sha256');
  signer.update(data);
  signer.end();
  return signer.sign(privateKey).toString('base64');
}

/** A {@link post} or {@link signedPost} request response */
export interface RequestResponse {
  status: number;
  headers: http.IncomingHttpHeaders;
  data: string;
}

/**
 * An `Error` object for HTTP requests
 */
export class RequestError extends Error {
  response?: RequestResponse;

  /**
   *
   * @param message - The error message string
   * @param response - The request response
   */
  constructor(message: string, response?: RequestResponse) {
    super(message);
    this.response = response;
  }
}

/**
 * An HTTP post request which is signed using HTTP signatures by the
 * passed in actor
 *
 * @param urlString - The URL for the request
 * @param body - The HTTP request body
 * @param actor - The ActivityPub actor which will sign the request
 * @returns The result of the HTTP request
 */
export function signedPost(
  urlString: string,
  body: string,
  actor: APActor
): Promise<RequestResponse> {
  const date = new Date().toUTCString();
  const url = new URL(urlString);
  const bodyHash = crypto.createHash('sha256').update(body).digest('base64');

  const headers = {
    Date: date,
    Host: url.host,
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    Digest: `sha-256=${bodyHash}`,
  };
  const headersWithTarget = {
    '(request-target)': `post ${url.pathname}`,
    ...headers,
  };
  const headerString = Object.entries(headersWithTarget)
    .map(([k, v]) => `${k.toLowerCase()}: ${v}`)
    .join('\n');
  const signature = signSha256(headerString, actor.privateKey);
  const sigKeyId = `${actor.uri}#main-key`;

  const sigHeaders = `(request-target) ${Object.keys(headers)
    .join(' ')
    .toLowerCase()}`;

  const signatureHeader = `keyId="${sigKeyId}",algorithm="${algorithm}",headers="${sigHeaders}",signature="${signature}"`;
  const options: http.RequestOptions = {
    method: 'POST',
    headers: {
      Signature: signatureHeader,
      ...headers,
    },
    timeout: timeout,
  };
  const request = url.protocol === 'https:' ? https.request : http.request;
  return new Promise<RequestResponse>((resolve, reject) => {
    const req = request(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        if (data.length + chunk.length <= 10240) {
          data += chunk;
        }
      });
      response.on('end', () => {
        if (response.statusCode) {
          const r: RequestResponse = {
            status: response.statusCode,
            headers: response.headers,
            data,
          };
          if (r.status >= 200 && r.status < 400) {
            resolve(r);
          } else {
            reject(new RequestError(`HTTP error code ${r.status}`, r));
          }
        } else {
          reject(new RequestError('No HTTP status code'));
        }
      });
      response.on('error', (err) => {
        const re = new RequestError(err.message);
        re.stack = err.stack;
        re.name = err.name;
        reject(re);
      });
    });
    req.write(body);
    req.end();
  });
}

/**
 * An HTTP post request
 *
 * @param urlString - The URL for the request
 * @param body - The HTTP request body
 * @returns The result of the HTTP request
 */
export function post(
  urlString: string,
  body: string
): Promise<RequestResponse> {
  const date = new Date().toUTCString();
  const url = new URL(urlString);

  const headers = {
    Date: date,
    Host: url.host,
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
  };
  const options: http.RequestOptions = {
    method: 'POST',
    headers: headers,
    timeout: 10000,
  };
  const request = url.protocol === 'https:' ? https.request : http.request;
  return new Promise<RequestResponse>((resolve, reject) => {
    const req = request(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        if (data.length + chunk.length <= 10240) {
          data += chunk;
        }
      });
      response.on('end', () => {
        if (response.statusCode) {
          const r: RequestResponse = {
            status: response.statusCode,
            headers: response.headers,
            data,
          };
          if (r.status >= 200 && r.status < 400) {
            resolve(r);
          } else {
            reject(new RequestError(`HTTP error code ${r.status}`, r));
          }
        } else {
          reject(new RequestError('No HTTP status code'));
        }
      });
      response.on('error', (err) => {
        const re = new RequestError(err.message);
        re.stack = err.stack;
        re.name = err.name;
        reject(re);
      });
    });
    req.write(body);
    req.end();
  });
}
