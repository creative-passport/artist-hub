import {
  Avatar,
  Box,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ReactComponent as DeleteIcon } from 'images/delete-icon.svg';
import { useAdminUnfollow } from 'hooks/useUnfollow';
import { useDialog } from 'providers/DialogProvider';
import { Follow } from 'types/api-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: '16px',
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  name: {
    fontSize: 16,
    color: '#222222',
    fontWeight: 'bold',
  },
  dataSourceLink: {
    marginRight: theme.spacing(1),
    fontSize: 12,
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

interface FollowItemProps {
  artistPageId: string;
  follow: Follow;
}

export function FollowItem({ artistPageId, follow }: FollowItemProps) {
  const classes = useStyles();

  const showDialog = useDialog();
  const unfollow = useAdminUnfollow(artistPageId);

  const unfollowHandler = () => {
    showDialog(
      'Delete data source',
      'Are you sure you want to delete the data source?',
      {
        onConfirm: () => unfollow.mutateAsync(follow.id),
        confirmButton: 'Delete',
      }
    );
  };

  return (
    <div key={follow.id} className={classes.root}>
      <Avatar className={classes.avatar} />
      <Box flexGrow={1}>
        <Typography className={classes.name}>{follow.name}</Typography>
        <Link
          href={follow.url}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.dataSourceLink}
          underline="hover"
          color="textSecondary"
        >
          @{follow.username}@{follow.domain}
        </Link>
      </Box>
      <IconButton aria-label="delete" onClick={unfollowHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
