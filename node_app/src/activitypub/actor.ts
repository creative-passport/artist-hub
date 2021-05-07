import axios from 'axios';
import config from '../config';
import { URL } from 'url';
import { APActor } from '../models/APActor';

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

function isActorLocal(uri: string): boolean {
  const url = new URL(uri);
  return url.hostname === config.domain;
}

/**
 * Finds an ActivityPub actor by URI
 *
 * @param uri - The actor URI
 * @returns An APActor model for the URI
 */
export async function getActor(uri: string): Promise<APActor | undefined> {
  let actor = await APActor.query().findOne({ uri: uri });
  if (!actor && !isActorLocal(uri)) {
    actor = await getRemoteActor(uri);
  }
  return actor;
}

/**
 * Polls a remote server to retrieve an ActivityPub actor
 *
 * @param uri - An actor ActivityPub URI
 * @returns An APActor model for the URI
 */
export async function getRemoteActor(uri: string): Promise<APActor> {
  const { data } = await axios.get(uri, {
    headers: {
      Accept: contentType,
    },
  });

  const url = new URL(uri);

  return await APActor.query()
    .insert({
      uri: data.id,
      url: data.url,
      domain: url.hostname,
      username: data.preferredUsername,
      actorType: data.type,
      publicKey: data.publicKey.publicKeyPem,
      inboxUrl: data.inbox,
      outboxUrl: data.outbox,
      sharedInboxUrl: data.endpoints?.sharedInbox,
      followersUrl: data.followers,
      followingUrl: data.following,
    })
    .returning('*')
    .first();
}
