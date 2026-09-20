import { useCallback, useEffect, useState } from 'react';

async function api(path, options) {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Something went wrong');
  }

  return response.status === 204 ? null : response.json();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setError('');
      setTasks(await api('/tasks'));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    try {
      setError('');
      const task = await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: cleanTitle }),
      });
      setTasks((current) => [task, ...current]);
      setTitle('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function toggleTask(task) {
    try {
      const updated = await api(`/tasks/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeTask(id) {
    try {
      await api(`/tasks/${id}`, { method: 'DELETE' });
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <main className="shell">
      <section className="card">
        <header>
          <span className="eyebrow">MERN starter</span>
          <h1>Task Board</h1>
          <p>{remaining} {remaining === 1 ? 'task' : 'tasks'} left to complete</p>
        </header>

        <form onSubmit={addTask}>
          <input
            aria-label="New task"
            maxLength="120"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            value={title}
          />
          <button type="submit">Add task</button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        {loading ? (
          <p className="state">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="state">Your board is clear. Add your first task.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className={task.completed ? 'completed' : ''}>
                <label>
                  <input
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                    type="checkbox"
                  />
                  <span>{task.title}</span>
                </label>
                <button className="delete" onClick={() => removeTask(task._id)} type="button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
