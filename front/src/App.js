import React, { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';

const generateUid = () => Math.random().toString(36).substr(2,9);



function Todo({ todo, completeTodo }) {
  let classNameTodo = "todo"
  if (todo.isCompleted) {
    classNameTodo += ' todo-done';
  }
  return (
    <div
      className={classNameTodo}
      // style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.label}
      <div>
        {!todo.isCompleted && <button onClick={() => completeTodo(todo.id)}>Complete</button>}
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {
  
  const [todos, setTodos] = useState([]);

  useEffect(function() {
    axios.get('http://localhost:5000/tasks')
      .then(res => {
        if(res.data.tasks.length > 0) {
          setTodos(res.data.tasks)
        }
      })
  }, [])

  const addTodo = label => {
    const newTodo = { label, isCompleted: false, id: generateUid() };
    const newTodos = [...todos, newTodo];
    axios.post('http://localhost:5000/tasks', newTodo)
      .then(res => console.log("add success", res))
      .catch(err => console.log("err: ", err))
    setTodos(newTodos);
  };

  const completeTodo = id => {
    const index = todos.findIndex( t => t.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
    axios.put('http://localhost:5000/tasks', newTodos[index])
      .then(res => (console.log("complete todo", res)))
      .catch(err => console.log("err: ", err))
  };

  const completeCount = () => {
    const result = todos.filter(todo => {
      return todo.isCompleted === true
    })
    return result.length;
  }

  return (
    <div className="app">
      <h1>TO DOs</h1>
      <div className="completeCounter">{`complete: ${completeCount()} / total: ${todos.length}`}</div>
      <div className="todo-list">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            completeTodo={completeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;