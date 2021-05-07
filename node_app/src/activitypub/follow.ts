import { APActor } from '../models/APActor';
import config from '../config';
import { APFollow } from '../models/APFollow';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from 'objection';

/**
 * Create an ActivityPub Follow Activity
 *
 * @param actor - An `APActor` model representing the follow Actor
 * @param target - An `APActor` model representing the follow target
 * @returns ActivityPub Follow JSON
 */
export async function createFollow(
  actor: APActor,
  target: APActor
): Promise<Record<string, unknown>> {
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

/**
 * Generate ActivityPub Follow JSON from an `APFollow` model
 *
 * @param follow - An `APFollow` model
 * @returns ActivityPub JSON for `follow`
 */
export async function followJson(
  follow: APFollow
): Promise<Record<string, unknown>> {
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

/**
 * Mark an ActivityPub follow request as Accepted
 *
 * @param uri - The follow URI
 * @param actor - The actor that made the follow request
 */
export async function acceptFollow(
  uri: string,
  actor?: APActor
): Promise<void> {
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

/**
 * Delete a rejected ActivityPub follow request
 *
 * @param uri - The follow URI
 * @param actor - The actor that made the follow request
 */
export async function rejectFollow(
  uri: string,
  actor?: APActor
): Promise<void> {
  try {
    const query = actor ? actor.$relatedQuery('following') : APFollow.query();
    await query.findOne({ uri }).delete().where({ uri });
  } catch (e) {
    if (!(e instanceof NotFoundError)) {
      throw e;
    }
  }
}
