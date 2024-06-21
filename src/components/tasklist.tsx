import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  removeTask: (id: string) => void;
  updateTaskTitle: (id: string, title: string) => void; // Adicione esta linha
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, toggleCompletion, removeTask, updateTaskTitle }) => {
  const { filter } = useParams<string>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") {
      return !task.completed;
    } else if (filter === "completed") {
      return task.completed;
    }
    return true;
  });

  const handleDoubleClick = (id: string, title: string) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleUpdate = (id: string) => {
    updateTaskTitle(id, newTitle);
    setEditingId(null);
  };

  return (
    <ul className="todo-list">
      {filteredTasks.map(task => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleCompletion(task.id)}
          />
          {editingId === task.id ? (
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={() => handleTitleUpdate(task.id)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleTitleUpdate(task.id);
                }
              }}
              autoFocus
            />
          ) : (
            <label onDoubleClick={() => handleDoubleClick(task.id, task.title)}>
              {task.title}
            </label>
          )}
          <button className="remove-btn" onClick={() => removeTask(task.id)}>X</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
