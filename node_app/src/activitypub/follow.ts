import { APActor } from '../models/APActor';
import config from '../config';
import { APFollow } from '../models/APFollow';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from 'objection';

export async function createFollow(actor: APActor, target: APActor) {
  const uri = `${config.baseUrl}/activity/${uuidv4()}`;
  const follow = await APFollow.query()
    .insert({
      uri,
      state: `pending`,
      actorId: actor.id,
      targetActorId: target.id,
    })
    .returning('*')
    .first();
  follow.actorFollower = actor;
  follow.actorFollowing = target;

  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    ...(await followJson(follow)),
  };
}

export async function followJson(follow: APFollow) {
  const actor =
    follow.actorFollower || (await follow.$relatedQuery('actorFollower'));
  const object =
    follow.actorFollowing || (await follow.$relatedQuery('actorFollowing'));

  return {
    type: 'Follow',
    id: follow.uri,
    actor: actor.uri,
    object: object.uri,
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
