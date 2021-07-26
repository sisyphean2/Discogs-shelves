import { useCallback, useState } from 'react';

import { Button, Input } from '@material-ui/core';

export default function Header({dispatch, errorMessage, pageNumber, setPageNumber, setUsername, username}) {
  const [addingShelf, setAddingShelf] = useState(false);
  const [addShelfInput, setAddShelfInput] = useState('');
  const [changingName, setChangingName] = useState(false);
  const [changeNameInput, setChangeNameInput] = useState('');
  const [pageIsValid, setPageIsValid] = useState(true);
  const [updatingPage, setUpdatingPage] = useState(false);
  const [updatePageInput, setUpdatePageInput] = useState('');

  const handlePageUpdate = useCallback(
    evt => {
      evt.preventDefault();
      setPageNumber(updatePageInput);
      setUpdatingPage(false);
      setUpdatePageInput('');
      return false;
    },
    [setPageNumber, updatePageInput],
  );

  const handleSubmit = useCallback(
    evt => {
      evt.preventDefault();
      dispatch({ type: 'createShelf', name: addShelfInput });
      setAddingShelf(false);
      setAddShelfInput('');
      return false;
    },
    [dispatch, addShelfInput],
  );

  // TODO (bcato): Add cancel buttons as well as submits
  // NOTE (bcato): alternate user: jondavey; recent additions can be found at https://www.discogs.com/group/recent/all
  const handleUsernameChange = useCallback(
    evt => {
      evt.preventDefault();
      setUsername(changeNameInput);
      setChangingName(false);
      setChangeNameInput('');
      return false;
    },
    [changeNameInput, setUsername],
  );

  const errorDisplay = errorMessage ? <h2 className={'error-display'}>{errorMessage}</h2> : null;
  const inputValidityDisplay = pageIsValid ? null : 
    <h3 className={'validity-display'}>Page must be a number greater than 0</h3>;

  return (
    <header>
      <h1>Record Shelves App</h1>

      <h2>
        <span className={'header-info'}>Current Username: {username}</span>
        <span className={'header-info'}>Current page: {pageNumber}</span>
      </h2>
      {errorDisplay}
      {changingName ? (
        <form onSubmit={handleUsernameChange} style={{ marginTop: '1rem' }}>
          <Input
            inputProps={{
              'data-testid': 'change-username',
            }}
            variant="outlined"
            value={changeNameInput}
            onChange={evt => setChangeNameInput(evt.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ marginLeft: '1rem' }}
          >
            Submit
          </Button>
        </form>
      ) : (
        <Button variant="contained" onClick={() => setChangingName(true)}>
          Change Username
        </Button>
      )}

      {updatingPage ? (
        <form onSubmit={handlePageUpdate} style={{ marginTop: '1rem' }}>
          <Input
            inputProps={{
              'data-testid': 'update-page',
            }}
            variant="outlined"
            value={updatePageInput}
            onChange={evt => {
              setUpdatePageInput(evt.target.value)
              const value = parseInt(evt.target.value, 10)
              setPageIsValid(Number.isInteger(value) && value > 0)
            }}
          />
          <Button
            disabled={!pageIsValid}
            type="submit"
            variant="contained"
            style={{ marginLeft: '1rem' }}
          >
            Submit
          </Button>
        </form>
      ) : (
        <Button variant="contained" onClick={() => {
          setPageIsValid(false)
          setUpdatingPage(true)
        }}>
          Change Page
        </Button>
      )}

      {addingShelf ? (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <Input
            inputProps={{
              'data-testid': 'add-shelf',
            }}
            variant="outlined"
            value={addShelfInput}
            onChange={evt => setAddShelfInput(evt.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ marginLeft: '1rem' }}
          >
            Submit
          </Button>
        </form>
      ) : (
        <Button variant="contained" onClick={() => setAddingShelf(true)}>
          Add Shelf
        </Button>
      )}
      {inputValidityDisplay}
    </header>
  )
}