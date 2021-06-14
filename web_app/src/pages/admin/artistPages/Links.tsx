import { Button, makeStyles } from '@material-ui/core';
import { ColumnTitle } from './ColumnTitle';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'types/api-types';
import { useState } from 'react';
import {
  useAdminCreateLink,
  useAdminDeleteLink,
  useAdminUpdateLink,
} from 'hooks/useAdminArtistPages';
import { EditTextField } from 'components/EditTextField';
import { useDialog } from 'providers/DialogProvider';
import { EditActions, TextFieldForm } from 'components/TextFieldForm';
import isURL from 'validator/es/lib/isURL';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  text: {
    lineHeight: 'normal',
    padding: '6px 0 6px',
  },
  multiline: {
    padding: '6px 0 6px',
    minHeight: 380,
  },
  textField: {
    alignItems: 'flex-start',
  },
  linkText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface LinksProps {
  artistPageId: string;
  links: Link[];
}

function validateLink(value: string) {
  return isURL(value, { require_protocol: true, protocols: ['http', 'https'] })
    ? undefined
    : 'Invalid URL';
}

export function Links({ artistPageId, links }: LinksProps) {
  const classes = useStyles();
  const [newLink, setNewLink] = useState<string | undefined>();
  const createLink = useAdminCreateLink(artistPageId);
  const updateLink = useAdminUpdateLink(artistPageId);
  const deleteLink = useAdminDeleteLink(artistPageId);
  const dialog = useDialog();

  const handleDone = (url: string, actions: EditActions) => {
    if (createLink.isLoading) {
      return;
    }
    createLink
      .mutateAsync({ url })
      .then(() => {
        actions.setSubmitting(false);
        setNewLink(undefined);
      })
      .catch((e) => {
        actions.setSubmitting(false);
      });
  };

  const handleUpdate = (id: string, url: string, done: () => void) => {
    updateLink.mutateAsync({ id, url }).then(done);
  };

  const handleDelete = (id: string, url: string, done: () => void) => {
    dialog('Delete website?', `Are you sure you want to delete ${url}`, {
      confirmButton: 'Delete',
      onConfirm: () => deleteLink.mutateAsync(id).then(done),
    });
  };

  return (
    <>
      <ColumnTitle
        title="Links"
        subtitle="Add personal links that you want to share"
      />
      {links.map((l) => (
        <div key={l.id}>
          <EditTextField
            value={l.url}
            singleLine
            textClassName={classes.linkText}
            onEdit={(url, done) => handleUpdate(l.id, url, done)}
            onDelete={(done) => handleDelete(l.id, l.url, done)}
            validate={validateLink}
          />
        </div>
      ))}
      {newLink != null ? (
        <TextFieldForm
          initialValue=""
          singleLine
          onEdit={(url, actions) => handleDone(url, actions)}
          onCancel={() => setNewLink(undefined)}
          TextFieldProps={{ placeholder: 'https://www.example.com' }}
          validate={validateLink}
        />
      ) : (
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setNewLink('')}
        >
          Add a link
        </Button>
      )}
    </>
  );
}
