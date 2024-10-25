import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TableComponent = () => {
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || {
    "Not Started": [],
    "In Progress": [],
    "Completed": [],
  };

  const [tasks, setTasks] = useState(initialTasks);
  const [draggedCard, setDraggedCard] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);
  const [newTask, setNewTask] = useState({ column: null, text: "" });
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (card, column) => {
    setDraggedCard(card);
    setSourceColumn(column);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); 
  };

  const handleDrop = (targetColumn) => {
    if (!draggedCard || sourceColumn === targetColumn) return;

    const newTasks = { ...tasks };

    newTasks[sourceColumn] = newTasks[sourceColumn].filter(
      (task) => task.title !== draggedCard.title
    );


    const updatedCard = { ...draggedCard, status: targetColumn };
    newTasks[targetColumn].push(updatedCard);

    setTasks(newTasks);
    setDraggedCard(null);
    setSourceColumn(null);
  };

  const handleNewTaskClick = (column) => {
    setNewTask({ column, text: "" });
    setError("");
  };

  const handleInputChange = (event) => {
    setNewTask({ ...newTask, text: event.target.value });
    setError("");
  };

  const handleAddTask = () => {
    const taskName = newTask.text.trim();

    if (!taskName) {
      setError("Task name cannot be empty.");
      return;
    }

    if (
      Object.values(tasks).some((col) => col.some((t) => t.title === taskName))
    ) {
      setError("Task name already exists.");
      return;
    }

    const newTaskObj = {
      title: taskName,
      description: "",
      status: newTask.column,
    };

    const newTasks = { ...tasks };
    newTasks[newTask.column].push(newTaskObj);

    setTasks(newTasks);
    setNewTask({ column: null, text: "" });
  };

  const handleNewStatusChange = (event) => {
    setNewStatus(event.target.value);
    setError("");
  };

  const handleAddStatus = () => {
    const statusName = newStatus.trim();

    if (!statusName) {
      setError("Status name cannot be empty.");
      return;
    }

    if (tasks[statusName]) {
      setError("Status name already exists.");
      return;
    }

    const newTasks = { ...tasks, [statusName]: [] };
    setTasks(newTasks);
    setNewStatus("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <input
          type="text"
          value={newStatus}
          onChange={handleNewStatusChange}
          className="p-2 border rounded-lg flex-grow"
          placeholder="Enter new status name"
        />
        <button
          onClick={handleAddStatus}
          className="bg-gray-600 text-white px-4 rounded hover:bg-gray-700"
        >
          Add Status
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10" >
        {Object.entries(tasks).map(([status, cards]) => (
          <div
            key={status}
            className="w-full"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
            
          >
            <div className="flex gap-2">
              <h3
                className={`text-md px-1 font-semibold mb-4 ${
                  status === "Not Started"
                    ? "bg-red-100"
                    : status === "In Progress"
                    ? "bg-yellow-100":
                    status === "Completed"?"bg-green-100"
                    : "bg-pink-100"
                }`}
              >
                {status}
              </h3>
              <div className="text-sm mt-1 text-gray-400">
                {tasks[status]?.length}
              </div>
            </div>
            <div className="space-y-4">
              {cards.map((card, index) => (
                <Link
                  to={`/details/${status}/${index}`}
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(card, status)}
                  className="p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition cursor-move block"
                >
                  {card.title}
                </Link>
              ))}

              {newTask.column === status ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newTask.text}
                    onChange={handleInputChange}
                    className="p-2 border rounded-lg flex-grow"
                    placeholder="Enter task name"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTask}
                    className="bg-gray-700 text-white px-4 py-2 rounded h-fit hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNewTaskClick(status)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  + New
                </button>
              )}

              {newTask.column === status && error && (
                <p className="text-red-500 mt-2">{error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableComponent;
