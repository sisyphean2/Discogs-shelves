import { List } from '@material-ui/core';

import Shelf from './Shelf';

export default function Shelves({ records, shelves, dispatch }) {
  return (
    <>
      <h2>Shelves</h2>
      <List
        style={{
          height: 'calc(100vh - 12rem)',
          overflowY: 'auto',
        }}
      >
        {Object.values(shelves).map(shelf => (
          <Shelf
            key={shelf.id}
            records={records}
            shelf={shelf}
            dispatch={dispatch}
          />
        ))}
      </List>
    </>
  );
}
