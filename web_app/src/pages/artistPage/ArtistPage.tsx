import { Button, Link, makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useArtistPage, useArtistPageFeed } from 'hooks/useArtistPage';
import { FeedItem } from './FeedItem';
import { ArtistPageLayout } from 'components/ArtistPageLayout';
import { NoMoreContent } from './NoMoreContent';
import React from 'react';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

const useStyles = makeStyles((theme) => ({
  feedItem: {
    marginBottom: theme.spacing(2),
  },
  headline: {
    fontWeight: 700,
    fontSize: 20,
    color: '#222222',
  },
  officialLinks: {
    fontWeight: 500,
    fontSize: 12,
    color: '#444440',
    textTransform: 'uppercase',
  },
  link: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: theme.spacing(1),
  },
  description: {},
}));

export function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const { isLoading, data } = useArtistPage(username);
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useArtistPageFeed(username);
  const classes = useStyles();

  if (isLoading || !data || !feedData) return <div>Loading</div>;

  const officialLinks = data.links;

  return (
    <ArtistPageLayout
      title={data.title}
      url={data.url}
      profileImage={data.profileImage}
      coverImage={data.coverImage}
      leftColumn={
        <>
          <Typography
            className={classes.headline}
            variant="h6"
            component="h3"
            gutterBottom
          >
            {data.headline}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {data.description}
          </Typography>
        </>
      }
      middleColumn={
        <>
          {feedData.pages.map((feedResult, i) => (
            <React.Fragment key={i}>
              {feedResult.data.map((f) => (
                <FeedItem
                  key={f.id}
                  feedItem={f}
                  className={classes.feedItem}
                />
              ))}
            </React.Fragment>
          ))}
          {hasNextPage ? (
            <div>
              <LoadMoreButton
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
              />
            </div>
          ) : (
            <div>
              <NoMoreContent />
            </div>
          )}
        </>
      }
      rightColumn={
        officialLinks.length > 0 && (
          <>
            <Typography
              className={classes.officialLinks}
              variant="h6"
              component="h3"
              gutterBottom
            >
              Official Links
            </Typography>
            <div>
              {officialLinks.map((link) => (
                <div key={link.id} className={classes.link}>
                  <Link
                    color="inherit"
                    href={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.url}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )
      }
    />
  );
}

interface LoadMoreButtonProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

function LoadMoreButton({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: LoadMoreButtonProps) {
  const loadMoreButtonRef = React.useRef<HTMLButtonElement>(null);
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <Button
      onClick={() => fetchNextPage()}
      disabled={isFetchingNextPage}
      ref={loadMoreButtonRef}
      fullWidth
    >
      Load more
    </Button>
  );
}
