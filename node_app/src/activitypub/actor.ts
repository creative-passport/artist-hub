import axios from 'axios';
import { URL } from 'url';
import { APActor } from '../models/APActor';

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

export async function getActor(uri: string) {
  let actor = await APActor.query().findOne({ uri: uri }).allowNotFound();
  if (!actor) {
    actor = await getRemoteActor(uri);
  }
  return actor;
}

export async function getRemoteActor(uri: string) {
  const { data } = await axios.get(uri, {
    headers: {
      Accept: contentType,
    },
  });

  const url = new URL(uri);

  return await APActor.query()
    .insert({
      uri: data.id,
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
