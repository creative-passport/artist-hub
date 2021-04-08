import { APActor } from '../models/APActor';
import config from '../config';
import { APFollow } from '../models/APFollow';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from 'objection';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export async function createFollow(actor: APActor, target: APActor) {
  const uri = `${config.baseUrl}/activity/${uuidv4()}`;
  await APFollow.query().insert({
    uri,
    state: `pending`,
    actorId: actor.id,
    targetActorId: target.id,
  });

  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Follow',
    id: uri,
    actor: actor.uri,
    object: target.uri,
  };
}

export async function acceptFollow(uri: string, actor?: APActor) {
  try {
    const query = actor ? actor.$relatedQuery('following') : APFollow.query();
    await query.findOne({ uri }).patch({
      state: 'accepted',
    });
  } catch (e) {
    if (!(e instanceof NotFoundError)) {
      throw e;
    }
  }
}

export async function rejectFollow(uri: string, actor?: APActor) {
  try {
    const query = actor ? actor.$relatedQuery('following') : APFollow.query();
    await query.findOne({ uri }).delete().where({ uri });
  } catch (e) {
    if (!(e instanceof NotFoundError)) {
      throw e;
    }
  }
}
