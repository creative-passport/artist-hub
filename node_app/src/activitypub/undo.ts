import { APObject } from '../models/APObject';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';

import { APActor } from '../models/APActor';
import { APFollow } from '../models/APFollow';
import { followJson } from './follow';

export async function createUndo(
  actor: APActor,
  object: APObject | APFollow
): Promise<Record<string, unknown>> {
  const uri = `${config.baseUrl}/activity/${uuidv4()}`;

  const objectJson =
    object instanceof APFollow ? await followJson(object) : object.uri;

  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Undo',
    id: uri,
    actor: actor.uri,
    object: objectJson,
  };
}
