import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/app.css";
import TaskList from './components/tasklist'; 

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos")
      .then(response => response.json())
      .then(data => {
        const initialTasks = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.isDone
        }));
        setTasks(initialTasks);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = (title: string) => {
    const newTask = { id: Date.now().toString(), title: title, completed: false };
    setTasks([newTask, ...tasks]);
  };

  const toggleCompletion = (id: string) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskTitle = (id: string, title: string) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, title: title } : task
    );
    setTasks(newTasks);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const toggleAllTasks = () => {
    const allCompleted = tasks.every(task => task.completed);
    const newTasks = tasks.map(task => ({ ...task, completed: !allCompleted }));
    setTasks(newTasks);
  };

  const itemCount = tasks.filter(task => !task.completed).length;

  return (
    <Router>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <div className="input-wrapper">
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  addTask(input.trim());
                  setInput("");
                }
              }}
              autoFocus
            />
            <button className="complete-all" onClick={toggleAllTasks}>
              ❯
            </button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<TaskList tasks={tasks} toggleCompletion={toggleCompletion} removeTask={removeTask} updateTaskTitle={updateTaskTitle} />} />
          <Route path="/:filter" element={<TaskList tasks={tasks} toggleCompletion={toggleCompletion} removeTask={removeTask} updateTaskTitle={updateTaskTitle} />} />
        </Routes>
        <footer>
          <span className="todo-count">{itemCount} items sobrando</span>
          <Link className="filter_todo" to="/">Todos</Link>
          <Link className="filter_todo" to="/active">Ativos</Link>
          <Link className="filter_todo" to="/completed">Completos</Link>
          <button className="clear_completed" onClick={clearCompleted}>Clear completed</button>
        </footer>
      </section>
    </Router>
  );
}
