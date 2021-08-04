/*
* SPDX-FileCopyrightText: 2021 Mahtab Ghamsari <mahtab@creativepassport.net>
*
* SPDX-License-Identifier: AGPL-3.0-only
*/

import { APActor } from '../models/APActor';
import { acceptFollow, rejectFollow } from './follow';
import { create } from './create';
import Debug from 'debug';
import { isActivity } from './validate';
const debug = Debug('artisthub:inbox');

/**
 * Process an ActivityPub Activity delivered to an inbox
 *
 * @param verifiedActor - The actor that signed the request
 * @param json - The request body as parsed JSON
 * @param deliverActor - The inbox actor (if not a shared inbox)
 */
export async function inbox(
  verifiedActor: APActor,
  json: unknown,
  deliverActor?: APActor
): Promise<void> {
  if (!isActivity(json)) {
    throw new Error('Invalid Activity JSON');
  }
  debug('Inbox JSON', JSON.stringify(json, undefined, 2));

  const actorId = typeof json.actor === 'string' ? json.actor : json.actor.id;
  if (verifiedActor.uri !== actorId) {
    throw new Error(
      `Verified actor doesn't match actor id ${verifiedActor.id} !== ${actorId}`
    );
  }

  const object = json.object;

  switch (json.type) {
    case 'Accept':
      if (object) {
        await acceptFollow(
          typeof object === 'string' ? object : object.id,
          deliverActor
        );
      }
      break;
    case 'Reject':
      if (object) {
        await rejectFollow(
          typeof object === 'string' ? object : object.id,
          deliverActor
        );
      }
      break;
    case 'Create':
      await create(json, deliverActor);
      break;
    default:
      debug('Unsupported message');
  }
}
