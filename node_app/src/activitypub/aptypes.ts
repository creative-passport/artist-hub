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

export type Actor = ObjectWithId;

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
