/*
* SPDX-FileCopyrightText: 2021 Mahtab Ghamsari <mahtab@creativepassport.net>
*
* SPDX-License-Identifier: AGPL-3.0-only
*/

import { APObject } from '../models/APObject';
import { APActor } from '../models/APActor';
import { getActor } from './actor';
import { PartialModelObject, UniqueViolationError } from 'objection';
import { APAttachment } from '../models/APAttachment';
import * as APTypes from './aptypes';
import { isNote } from './validate';

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const videoMimeTypes = ['video/mp4'];

const supportedMimeTypes = [...imageMimeTypes, ...videoMimeTypes];

const asArray = <T extends unknown>(value: T[] | T) =>
  Array.isArray(value) ? value : [value];

function getId<T extends { id?: string } | { id: string }>(
  value: T | string
): string | T['id'] {
  return typeof value === 'string' ? value : value.id;
}

/**
 * Handle an ActivityPub Create activity
 *
 * @param json - ActivityPub Activity JSON
 * @param deliverActor - The actor the message was delivered to (if not a shared inbox)
 */
export async function create(
  json: APTypes.Activity,
  deliverActor?: APActor
): Promise<void> {
  const object = json.object;
  if (object && isNote(object)) {
    const actor = await getActor(getId(json.actor));
    if (!actor) {
      return;
    }

    if (deliverActor) {
      const following = await deliverActor
        .$relatedQuery('following')
        .withGraphJoined('actorFollowing')
        .findOne({ state: 'accepted', 'actorFollowing.uri': actor.uri });
      if (!following) {
        // The user isn't following the account
        return;
      }
    }

    let note: APObject | undefined = undefined;
    try {
      // Find or create note
      note = await actor
        .$relatedQuery('objects')
        .insert({
          uri: object.id,
          objectType: 'Note',
          url: typeof object.url === 'string' ? object.url : undefined,
          content:
            typeof object.content === 'string' ? object.content : undefined,
        })
        .returning('*')
        .first();

      if (object.attachment) {
        const newAttachments: PartialModelObject<APAttachment>[] = [];
        for (const a of asArray(object.attachment)) {
          if (newAttachments.length >= 4) {
            break;
          }

          const newAttachment: PartialModelObject<APAttachment> = {
            url: a.url,
            type: a.type,
            description: a.name,
            mediaType: a.mediaType,
            blurhash: a.blurhash,
            thumbnailUrl: thumbnailUrlFromAttachment(a),
          };
          if (!supportedMimeTypes.includes(newAttachment.mediaType)) {
            continue;
          }
          newAttachments.push(newAttachment);
        }
        if (newAttachments.length > 0) {
          await note.$relatedQuery('attachments').insert(newAttachments);
        }
      }
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        note = await actor.$relatedQuery('objects').findOne({
          uri: object.id,
        });
      } else {
        throw err;
      }
    }

    const recipients = deliverActor
      ? [deliverActor]
      : await actor.acceptedFollowers();
    try {
      await note
        .$relatedQuery('deliveredActors')
        .relate(recipients)
        .onConflict(['actorId', 'objectId'])
        .ignore();
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        // Already delivered
      } else {
        throw err;
      }
    }
    return;
  }
}

function thumbnailUrlFromAttachment(
  attachment: APTypes.Attachment
): string | undefined {
  if (typeof attachment.icon === 'object' && attachment.icon !== null) {
    return attachment.icon.url;
  } else {
    return attachment.icon;
  }
}
