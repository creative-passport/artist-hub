import { IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAdminUnfollow } from '../../../hooks/useUnfollow';
import { useDialog } from '../../../providers/DialogProvider';
import { Follow } from '../../../types/api-types';

const useStyles = makeStyles((theme) => ({
  dataSource: {
    margin: theme.spacing(2),
  },
  dataSourceLink: {
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
    <div key={follow.id} className={classes.dataSource}>
      <a
        href={follow.url}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.dataSourceLink}
      >
        @{follow.username}@{follow.domain}
      </a>
      <IconButton aria-label="delete" onClick={unfollowHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
