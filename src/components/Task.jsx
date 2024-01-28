import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Draggable } from "react-beautiful-dnd";

export const Task = ({ task, deleteTodo, editTodo, toggleComplete, index }) => {
  const formattedDate = new Date(task.dateAdded).toLocaleString();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`Todo ${task.completed ? "completed" : "incompleted"}`}
        >
          <div className="task-info">
            <p onClick={() => toggleComplete(task.id)}>{task.task}</p>
            <span className="date-added">{formattedDate}</span>
          </div>
          <div className="task-actions">
            <button
              className="complete-button"
              onClick={() => toggleComplete(task.id)}
            >
              {task.completed ? "Incomplete" : "Complete"}
            </button>
            <FontAwesomeIcon
              className="edit-icon"
              icon={faPenToSquare}
              onClick={() => editTodo(task.id)}
            />
            <FontAwesomeIcon
              className="delete-icon"
              icon={faTrash}
              onClick={() => deleteTodo(task.id)}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};
