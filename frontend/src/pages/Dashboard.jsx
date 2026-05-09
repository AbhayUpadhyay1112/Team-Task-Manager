import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const handleEdit = (task) => {

    setEditingId(task.id);

    setTitle(task.title);

    setDescription(task.description);

    setPriority(task.priority || "Medium");

    setDueDate(
      task.due_date
        ? task.due_date.split("T")[0]
        : ""
    );
  };

  const createTask = async () => {

    try {

      const token = localStorage.getItem("token");

      if (editingId) {

        await API.put(
          `/tasks/${editingId}`,
          {
            title,
            description,
            priority,
            due_date: dueDate || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task Updated");

      } else {

        await API.post(
          "/tasks",
          {
            title,
            description,
            status: "todo",
            priority,
            due_date: dueDate || null,
            assigned_to: 1,
            project_id: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task Created");
      }

      setEditingId(null);

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      fetchTasks();

    } catch (err) {

      console.log(err.response?.data || err);

      alert("Task operation failed");
    }
  };

  const deleteTask = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();

    } catch (err) {

      console.log(err);
    }
  };

  const moveTask = async (task) => {

    try {

      const token = localStorage.getItem("token");

      let newStatus = "todo";

      if (task.status === "todo") {
        newStatus = "in-progress";
      }

      else if (task.status === "in-progress") {
        newStatus = "completed";
      }

      else {
        newStatus = "todo";
      }

      await API.put(
        `/tasks/${task.id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

    } catch (err) {

      console.log(err);
    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const renderTasks = (status) => {

    return filteredTasks
      .filter((task) => task.status === status)
      .map((task) => (

        <div
          key={task.id}
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        >

          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>
            Priority: <b>{task.priority || "Medium"}</b>
          </p>

          <p>
            Due Date:{" "}
            <b>
              {
                task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "No date"
              }
            </b>
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >

            <button
              onClick={() => handleEdit(task)}
              style={editBtn}
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              style={deleteBtn}
            >
              Delete
            </button>

            <button
              onClick={() => moveTask(task)}
              style={moveBtn}
            >
              Move
            </button>

          </div>

        </div>
      ));
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "white",
        padding: "40px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >

        <h1>Dashboard</h1>

        <button
          onClick={logout}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "15px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={createTask}
          style={createBtn}
        >
          {editingId ? "Update Task" : "Create Task"}
        </button>

      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
        }}
      >

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="All">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "25px",
        }}
      >

        <div style={columnStyle}>
          <h2>Todo</h2>
          <hr />
          {renderTasks("todo")}
        </div>

        <div style={columnStyle}>
          <h2>In-Progress</h2>
          <hr />
          {renderTasks("in-progress")}
        </div>

        <div style={columnStyle}>
          <h2>Completed</h2>
          <hr />
          {renderTasks("completed")}
        </div>

      </div>

    </div>
  );
}

const inputStyle = {
  backgroundColor: "#172554",
  color: "white",
  border: "2px solid #3b82f6",
  padding: "15px",
  borderRadius: "15px",
  fontSize: "18px",
  outline: "none",
};

const createBtn = {
  backgroundColor: "#2563eb",
  border: "none",
  color: "white",
  padding: "15px 30px",
  borderRadius: "15px",
  cursor: "pointer",
  fontSize: "18px",
};

const editBtn = {
  backgroundColor: "#2563eb",
  border: "none",
  color: "white",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
};

const deleteBtn = {
  backgroundColor: "#dc2626",
  border: "none",
  color: "white",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
};

const moveBtn = {
  backgroundColor: "#16a34a",
  border: "none",
  color: "white",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
};

const columnStyle = {
  backgroundColor: "#0f172a",
  padding: "25px",
  borderRadius: "20px",
};