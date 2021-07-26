import { useCallback, useEffect, useReducer, useState } from 'react';

import { Container, Grid } from '@material-ui/core';

import { DragDropContext } from 'react-beautiful-dnd';

import { reducer } from './reducer';

import Header from './components/Header';
import RecordsContainer from './components/RecordsContainer';
import Shelves from './components/Shelves';

export default function App() {
  // TODO (bcato): Make it so multiple draggable elements of the same record do not act like a single element
  // TODO (bcato): Improve the behavior of these headers buttons so they don't move each other around on clicking
  // TODO (bcato): Add validation for username and shelf name
  // TODO (bcato): Fix being able to click on left/top of div containing the input for page/user/shelf updates
  // TODO (bcato): Display an acknowledgement on page/user update until network response comes in
  // TODO (bcato): Make shelf rename capacity more visible
  const [errorMessage, setErrorMessage] = useState('');
  const [pageNumber, setPageNumber] = useState('1');
  const [records, setRecords] = useState([]);
  const [username, setUsername] = useState('blacklight');

  const [shelves, dispatch] = useReducer(reducer, {});

  const onDragEnd = useCallback(
    result => {
      const { source, destination, draggableId } = result;

      if (!destination) {
        return;
      }

      // TODO (bcato): Let the user know dropping in the left side is not allowed (or support it).
      // TODO (bcato): Move "records-container" to an enum/constant.
      if (destination.droppableId === "records-container") {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        dispatch({
          type: 'reorderInShelf',
          shelfId: source.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      } else if (source.droppableId === "records-container") {
        // TODO (bcato): Do this without using draggableID which is not guaranteed to match record.id.
        dispatch({
          type: 'addRecordToShelf',
          newIndex: destination.index,
          shelfId: destination.droppableId,
          recordId: draggableId,
        });
      } else {
        dispatch({
          type: 'moveBetweenShelves',
          oldShelf: source.droppableId,
          newShelf: destination.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const url = `https://api.discogs.com/users/${username}/collection/folders/0/releases?page=${pageNumber}&per_page=50`
    fetch(url)
      .then(resp => {
          if (resp.status !== 200) {
            throw ({
              json: resp.json(),
              status: resp.status,
            })
          }
          return resp.json();
      })
      .then(
        (json) => {
          setErrorMessage('');
          setRecords(json.releases.map(release => {
            const { id, basic_information: info } = release;
            return {
              id: `${id}`,
              title: info.title,
              formats: info.formats.map(format => format.name),
              label: info.labels?.[0]?.name ?? '',
              artists: info.artists.map(artist => artist.name),
              date: info.year,
            };
          }));
        },
        (error) => {
          const status = error.status
          error.json.then(json => {
            const errorText = `The server has responded with a ${status} error. `;
            const jsonText = `If it returned a message, that message is: ${json.message}.`;
            setErrorMessage(errorText + jsonText);
          })
        }
      );
  }, [pageNumber, username]);

  return (
    <Container>
      <Header 
        dispatch={dispatch}
        errorMessage={errorMessage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setUsername={setUsername}
        username={username}
      >
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <RecordsContainer
              records={records}
              shelves={shelves}
              dispatch={dispatch}
            />
          </Grid>

          <Grid item xs={9}>
            <Shelves records={records} shelves={shelves} dispatch={dispatch} />
          </Grid>
        </Grid>
      </DragDropContext>
    </Container>
  );
}
