import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskForm } from './TaskForm';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './Task';
import { EditForm } from './EditForm';


export const TaskWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  }, []);

  const addTodo = (todo) => {
    const newTodos = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false, dateAdded: new Date().toLocaleString() },
    ];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const filterTasks = (type) => {
    setFilter(type);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedTodos = Array.from(todos);
    const [removed] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, removed);

    setTodos(reorderedTodos);
    localStorage.setItem('todos', JSON.stringify(reorderedTodos));
  };

  const filteredTodos = filter === 'all' ? todos : todos.filter((todo) => todo.completed === (filter === 'completed'));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className='TodoWrapper'>
            <h1>React Task Tracker</h1>
            <div className="filter-buttons">
              <button onClick={() => filterTasks('all')}>All</button>
              <button onClick={() => filterTasks('completed')}>Completed</button>
              <button onClick={() => filterTasks('incomplete')}>Incomplete</button>
            </div>
            <TaskForm addTodo={addTodo} />
            {filteredTodos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {todo.isEditing ? (
                      <EditForm editTodo={editTask} task={todo} key={index} />
                    ) : (
                      <Task
                        task={todo}
                        key={index}
                        index={index}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
