import { List } from '@material-ui/core';

import { Draggable, Droppable } from 'react-beautiful-dnd';

import Record from './Record';

export default function RecordsContainer({ records, shelves, dispatch }) {
  return (
    <>
      <h2>Records</h2>
      <Droppable droppableId={'records-container'} direction="horizontal">
        {(provided, snapshot) => (
          <List
            ref={provided.innerRef}
            style={{
              backgroundColor: '#f5f5f5',
              height: 'calc(100vh - 12rem)',
              overflow: 'scroll',
            }}
          >
            {records.map((record, index) => (
              <Draggable
                key={record.id}
                draggableId={record.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <span
                    key={record.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Record
                      key={record.id}
                      record={record}
                      shelves={shelves}
                      dispatch={dispatch}
                    />
                  </span>
                )}
              </Draggable>
            ))}
          </List>
        )}
      </Droppable>
    </>
  );
}
