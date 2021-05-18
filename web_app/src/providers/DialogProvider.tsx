import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Dialog } from 'components/Dialog';
import React, { PropsWithChildren, useCallback, useReducer } from 'react';

export const DialogDispatchContext = React.createContext<
  React.Dispatch<Action> | undefined
>(undefined);

interface DialogOptions {
  key: number;
  open: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmButton?: string;
  cancelButton?: string;
}

interface State {
  active?: DialogOptions;
  queue: DialogOptions[];
}

interface ShowAction {
  type: 'show';
  payload: DialogOptions;
}

interface ActionWithoutPayload {
  type: 'close' | 'confirm' | 'exit';
}

type Action = ShowAction | ActionWithoutPayload;

function dialogReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'show': {
      // Received a new dialog
      if (!state.active) {
        // No active dialog, just show it
        return { ...state, active: action.payload };
      } else {
        // There is an active dialog, so we add it to the queue
        return { ...state, queue: [...state.queue, action.payload] };
      }
    }
    case 'close': {
      // The dialog is closing
      if (state.active?.onCancel) {
        state.active.onCancel();
      }
      return {
        ...state,
        active: state.active ? { ...state.active, open: false } : undefined,
      };
    }
    case 'confirm': {
      // The dialog is confirmed
      if (state.active?.onConfirm) {
        state.active.onConfirm();
      }
      return {
        ...state,
        active: state.active ? { ...state.active, open: false } : undefined,
      };
    }
    case 'exit': {
      // The dialog has finished closing
      if (state.queue.length > 0) {
        // Show the next one
        return {
          ...state,
          active: { ...state.queue[0] },
          queue: state.queue.splice(1),
        };
      } else {
        // No more dialogs, just clear active
        return { ...state, active: undefined };
      }
    }
  }
}

export function useDialog() {
  const dispatch = React.useContext(DialogDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  function showDialogAction(
    title: string,
    message: string,
    {
      onConfirm,
      onCancel,
      cancelButton,
      confirmButton,
    }: {
      onConfirm?: () => void;
      onCancel?: () => void;
      cancelButton?: string;
      confirmButton?: string;
    }
  ) {
    if (dispatch) {
      dispatch({
        type: 'show',
        payload: {
          key: new Date().getTime(),
          message,
          title,
          onConfirm,
          onCancel,
          cancelButton,
          confirmButton,
          open: true,
        },
      });
    }
  }

  return showDialogAction;
}

function DialogProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(dialogReducer, {
    active: undefined,
    queue: [],
  });
  const handleClose = useCallback(() => dispatch({ type: 'close' }), []);
  const handleExit = useCallback(() => dispatch({ type: 'exit' }), []);
  const handleConfirm = useCallback(() => dispatch({ type: 'confirm' }), []);

  return (
    <DialogDispatchContext.Provider value={dispatch}>
      {state.active && (
        <>
          <Dialog
            onClick={(e) => e.stopPropagation()}
            key={state.active.key}
            open={state.active.open}
            onClose={handleClose}
            onExited={handleExit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {state.active.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {state.active.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                {state.active.cancelButton || 'Cancel'}
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                color="primary"
                autoFocus
              >
                {state.active.confirmButton || 'Confirm'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {children}
    </DialogDispatchContext.Provider>
  );
}

export default DialogProvider;
