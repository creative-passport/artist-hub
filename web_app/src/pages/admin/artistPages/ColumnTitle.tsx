import { Divider, makeStyles, Typography } from '@material-ui/core';

interface ColumnTitleProps {
  title: string;
  subtitle: string;
}

const useStyles = makeStyles((theme) => ({
  columnTitle: {
    marginTop: theme.spacing(2),
  },
  columnDescriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: '3rem',
    marginBottom: theme.spacing(1),
  },
}));

export function ColumnTitle({ title, subtitle }: ColumnTitleProps) {
  const classes = useStyles();
  return (
    <>
      <Typography
        component="h3"
        variant="h4"
        className={classes.columnTitle}
        gutterBottom
      >
        {title}
      </Typography>
      <div className={classes.columnDescriptionContainer}>
        <Typography gutterBottom variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      </div>
      <Divider />
    </>
  );
}
