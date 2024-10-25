import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const TaskDetails = () => {
  const { status, taskIndex } = useParams();
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || {}
  );
  const navigate = useNavigate();
  const task = tasks[status][taskIndex];
  const [updatedTask, setUpdatedTask] = useState(task);
  const [newStatus, setNewStatus] = useState(status);
  const handleInputChange = (e) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };
  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };
  const handleSave = () => {
    const newTasks = { ...tasks };
    if (newStatus != status) {
      newTasks[status] = newTasks[status].filter(
        (_, index) => index !== parseInt(taskIndex)
      );
      newTasks[newStatus].push(updatedTask);
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    } else {
      newTasks[status][taskIndex] = updatedTask;
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    }
    navigate("/");
  };

  const handleDelete = () => {
    debugger;
    const newTasks = { ...tasks };
    newTasks[status] = newTasks[status].filter(
      (_, index) => index !== parseInt(taskIndex)
    );
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    console.log(newTasks);
    navigate("/");
  };

  return (
    <div className="p-6">
        <Link to="/" className="flex mb-5">
        <img src="/images/back-icon.png"className="size-5"/>
        </Link>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        value={updatedTask?.title}
        onChange={handleInputChange}
        className="p-2 border rounded-lg w-full mb-4"
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={updatedTask?.description}
        onChange={handleInputChange}
        className="p-2 border rounded-lg w-full mb-4"
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        value={newStatus}
        onChange={handleStatusChange}
        className="p-2 border rounded-lg w-full mb-4"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Save
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskDetails;
