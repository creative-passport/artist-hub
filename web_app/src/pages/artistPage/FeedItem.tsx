import { Avatar, makeStyles } from '@material-ui/core';
import { FeedItem as FeedItemType } from 'types/api-types';
import clsx from 'clsx';

interface FeedItemProps {
  className?: string;
  feedItem: FeedItemType;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.2)',
    padding: theme.spacing(2),
    display: 'flex',
  },
  container: {
    marginLeft: theme.spacing(2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  account: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  content: {
    '& p': {
      margin: 0,
    },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    <div className={clsx(classes.root, className)}>
      <Avatar src={feedItem.iconUrl}>
        {feedItem.username[0]?.toUpperCase()}
      </Avatar>
      <div className={classes.container}>
        <div className={classes.account}>
          <a
            href={feedItem.accountUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {feedItem.username}@{feedItem.domain}
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
    </div>
  );
}
