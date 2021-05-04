import { APActor } from '../models/APActor';
import { acceptFollow, rejectFollow } from './follow';
import { create } from './create';
import Debug from 'debug';
const debug = Debug('artisthub:inbox');

export async function inbox(json: any, deliverActor?: APActor) {
  debug('Inbox JSON', JSON.stringify(json, undefined, 2));
  const object = json.object;

  switch (json.type) {
    case 'Accept':
      if (object) {
        await acceptFollow(
          typeof object === 'string' ? object : object.id,
          deliverActor
        );
        break;
      }
    case 'Reject':
      if (object) {
        await rejectFollow(
          typeof object === 'string' ? object : object.id,
          deliverActor
        );
        break;
      }
    case 'Create':
      await create(json, deliverActor);
      break;
    default:
      debug('Unsupported message');
  }
}
