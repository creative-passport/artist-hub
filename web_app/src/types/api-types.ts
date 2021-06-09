export interface ArtistPage {
  id: string;
  title: string;
  headline?: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;

  url: string;
  username: string;

  following: Follow[];
  links: Link[];

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateArtistPage {
  id: string;
  title?: string;
  headline?: string;
  description?: string;
  profileImage?: File;
  coverImage?: File;
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

export interface Link {
  id: string;
  sort: number;
  url: string;
}

export interface UpdateLink {
  id: string;
  url: string;
}

export interface Attachment {
  id: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  mediaType: string;
  blurhash?: string;
}
