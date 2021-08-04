/*
* SPDX-FileCopyrightText: 2021 Mahtab Ghamsari <mahtab@creativepassport.net>
*
* SPDX-License-Identifier: AGPL-3.0-only
*/


export interface Object {
  id?: string;
  type: string;
}

export interface ObjectWithId extends Object {
  id: string;
}

export interface Link {
  type: string;
  href: string;
}

export interface Actor extends ObjectWithId {
  url?: string;
  type: string;
  preferredUsername?: string;
  name?: string;
  icon?: string | { type: string; url: string };
  publicKey: {
    publicKeyPem: string;
  };
  inbox: string;
  outbox: string;
  endpoints?: {
    sharedInbox?: string;
  };
  followers?: string;
  following?: string;
}

export interface Attachment extends Object {
  url: string;
  name?: string;
  mediaType: string;
  blurhash?: string;
  icon?: string | { url: string };
}

export interface Note extends ObjectWithId {
  type: 'Note';

  url?: string;
  content?: string;
  attachment?: Attachment | Attachment[];
}

export interface Activity extends Object {
  actor: Actor | string;
  object?: ObjectWithId | string;
}
