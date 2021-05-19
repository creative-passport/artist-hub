export interface ArtistPage {
  id: string;
  title: string;
  headline?: string;
  description?: string;

  url: string;
  username: string;

  following: Follow[];

  feed: FeedItem[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
  id: string;
  followState: string;
  followUri: string;
  url: string;
  username: string;
  name: string;
  domain: string;
}

export interface FeedItem {
  id: string;
  accountUrl: string;
  name: string;
  username: string;
  domain: string;
  url: string;
  content: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  mediaType: string;
  blurhash?: string;
}
