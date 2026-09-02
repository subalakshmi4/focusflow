import { useEffect, useMemo, useState } from "react";
import "./App.css";

const defaultTasks = [
  {
    id: 1,
    title: "Learn React Hooks",
    category: "Study",
    priority: "High",
    deadline: "2026-09-05",
    completed: false,
  },
  {
    id: 2,
    title: "Build portfolio project",
    category: "Project",
    priority: "Medium",
    deadline: "2026-09-08",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("focusflow-tasks");
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [darkMode, setDarkMode] = useState(true);

  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Save tasks to LocalStorage
  useEffect(() => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Pomodoro timer
  useEffect(() => {
    let timer;

    if (timerRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((previous) => previous - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setTimerRunning(false);
      alert("Focus session completed! 🎉");
    }

    return () => clearInterval(timer);
  }, [timerRunning, seconds]);

  // Add task
  function addTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      priority,
      deadline,
      completed: false,
    };

    setTasks((previous) => [newTask, ...previous]);

    setTitle("");
    setCategory("Study");
    setPriority("Medium");
    setDeadline("");
  }

  // Complete / uncomplete task
  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Delete task
  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  // Delete completed tasks
  function clearCompleted() {
    setTasks((previous) =>
      previous.filter((task) => !task.completed)
    );
  }

  // Reset timer
  function resetTimer() {
    setTimerRunning(false);
    setSeconds(25 * 60);
  }

  // Search + filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && !task.completed) ||
        (filter === "Completed" && task.completed) ||
        task.category === filter ||
        task.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const activeTasks = tasks.length - completedTasks;

  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  function formatTime() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      {/* NAVBAR */}
      <header className="navbar">
        <div>
          <h1>
            Focus<span>Flow</span>
          </h1>

          <p>Plan smarter. Focus deeper.</p>
        </div>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main className="container">

        {/* HERO */}
        <section className="welcome">

          <div>
            <p className="small-title">
              YOUR PRODUCTIVITY HUB
            </p>

            <h2>Turn plans into progress.</h2>

            <p>
              Organize your work, track your goals and stay focused.
            </p>
          </div>

          <div className="progress-box">

            <div className="progress-circle">
              <strong>{progress}%</strong>
            </div>

            <span>Overall Progress</span>

          </div>

        </section>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <span>📋</span>

            <div>
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <span>🔥</span>

            <div>
              <h3>{activeTasks}</h3>
              <p>Active</p>
            </div>
          </div>

          <div className="stat-card">
            <span>✅</span>

            <div>
              <h3>{completedTasks}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <span>🎯</span>

            <div>
              <h3>{progress}%</h3>
              <p>Success Rate</p>
            </div>
          </div>

        </section>

        {/* ADD TASK + TIMER */}
        <div className="grid">

          {/* ADD TASK */}
          <section className="panel">

            <div className="panel-title">
              <h2>➕ Add New Task</h2>

              <span>Quick Capture</span>
            </div>

            <form onSubmit={addTask}>

              <input
                type="text"
                placeholder="What do you want to accomplish?"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />

              <div className="form-row">

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>Study</option>
                  <option>Project</option>
                  <option>Work</option>
                  <option>Personal</option>
                </select>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

              </div>

              <input
                type="date"
                value={deadline}
                onChange={(event) =>
                  setDeadline(event.target.value)
                }
              />

              <button className="add-btn">
                Add Task 🚀
              </button>

            </form>

          </section>

          {/* TIMER */}
          <section className="panel timer-panel">

            <div className="panel-title">
              <h2>⏱️ Focus Timer</h2>

              <span>Pomodoro</span>
            </div>

            <div className="timer">
              {formatTime()}
            </div>

            <p>25-minute deep work session</p>

            <div className="timer-buttons">

              <button
                className="start-btn"
                onClick={() =>
                  setTimerRunning(!timerRunning)
                }
              >
                {timerRunning ? "Pause" : "Start Focus"}
              </button>

              <button
                className="reset-btn"
                onClick={resetTimer}
              >
                Reset
              </button>

            </div>

          </section>

        </div>

        {/* TASKS */}
        <section className="tasks-section">

          <div className="task-header">

            <div>
              <h2>My Tasks</h2>

              <p>
                Stay organized and get things done.
              </p>
            </div>

            <button
              className="clear-btn"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>

          </div>

          {/* SEARCH AND FILTER */}
          <div className="controls">

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option>All</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Study</option>
              <option>Project</option>
              <option>Work</option>
              <option>Personal</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

          </div>

          {/* TASK LIST */}
          <div className="task-list">

            {filteredTasks.length === 0 ? (

              <div className="empty">

                <div>✨</div>

                <h3>No tasks found</h3>

                <p>
                  Try adding a new task or changing your filter.
                </p>

              </div>

            ) : (

              filteredTasks.map((task) => (

                <article
                  className={`task ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >

                  <button
                    className="check"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    <div className="badges">

                      <span className="category">
                        {task.category}
                      </span>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      {task.deadline && (
                        <span className="deadline">
                          📅 {task.deadline}
                        </span>
                      )}

                    </div>

                  </div>

                  <button
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️
                  </button>

                </article>

              ))

            )}

          </div>

        </section>

      </main>

      <footer>
        FocusFlow © 2026 · Built with React ⚛️
      </footer>

    </div>
  );
}

export default App;