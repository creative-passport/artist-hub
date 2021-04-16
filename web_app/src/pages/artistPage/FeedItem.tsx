import { makeStyles } from '@material-ui/core';
import { FeedItem as FeedItemType } from '../../types/api-types';

interface FeedItemProps {
  className?: string;
  feedItem: FeedItemType;
}

const useStyles = makeStyles((theme) => ({
  content: {
    '& p': {
      margin: 0,
    },
  },
  attachments: {
    display: 'flex',
    '& img': {
      maxHeight: 300,
    },
  },
}));

export function FeedItem({ className, feedItem }: FeedItemProps) {
  const classes = useStyles();
  return (
    <div className={className}>
      <div>
        <a href={feedItem.accountUrl} target="_blank" rel="noopener noreferrer">
          {feedItem.username}@{feedItem.domain}
        </a>
      </div>
      <div>
        <a href={feedItem.url} target="_blank" rel="noopener noreferrer">
          {feedItem.url}
        </a>
      </div>
      <div
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: feedItem.content }} // feedItem.content has already been sanitized on the server
      />
      {feedItem.attachments && (
        <div className={classes.attachments}>
          {feedItem.attachments.map((a) => (
            <div key={a.id}>
              {a.mediaType.startsWith('image') && (
                <img src={a.thumbnailUrl || a.url} alt={a.description} />
              )}
              {a.mediaType.startsWith('video') && (
                <video controls width="400" aria-label={a.description}>
                  <source src={a.url} type={a.mediaType} />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
