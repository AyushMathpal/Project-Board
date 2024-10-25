import TableComponent from "./components/TableComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css"
import TaskDetails from "./components/TaskDetails";
export default function App() {
  return (
    <BrowserRouter>
    <main className="app">
      <Routes>
        <Route path="/" element={<TableComponent/>} />
        <Route path="/details/:status/:taskIndex" element={<TaskDetails />} />
      </Routes>
    </main>
  </BrowserRouter>
  )
}