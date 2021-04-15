export interface ArtistPage {
  id: string;
  title: string;
  username: string;

  feed: FeedItem[];

  createdAt: Date;
  updatedAt: Date;
}

export interface FeedItem {
  id: string;
  accountUrl: string;
  username: string;
  domain: string;
  url: string;
  content: string;
}
