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
      <div>{feedItem.url}</div>
      <div
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: feedItem.content }} // feedItem.content has already been sanitized on the server
      />
    </div>
  );
}
