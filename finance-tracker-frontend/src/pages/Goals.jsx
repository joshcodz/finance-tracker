import { useEffect, useState } from 'react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const token = localStorage.getItem('token');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function fetchGoals() {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to load goals');
        return;
      }
      setGoals(data);
    } catch (err) {
      console.error('Fetch goals error:', err);
      alert('Error loading goals');
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert('Please login first');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          targetAmount: Number(form.targetAmount),
          currentAmount: Number(form.currentAmount) || 0,
          deadline: form.deadline || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to create goal');
        return;
      }
      setForm({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
      fetchGoals();
    } catch (err) {
      console.error('Create goal error:', err);
      alert('Error creating goal');
    }
  }

  async function handleUpdateAmount(id, newAmount) {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentAmount: Number(newAmount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to update goal');
        return;
      }
      setGoals((prev) => prev.map((g) => (g._id === id ? data : g)));
    } catch (err) {
      console.error('Update goal error:', err);
      alert('Error updating goal');
    }
  }

  async function handleDelete(id) {
    if (!token) return;
    if (!confirm('Delete this goal?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to delete goal');
        return;
      }
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error('Delete goal error:', err);
      alert('Error deleting goal');
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <h2>Savings Goals</h2>

      <h3>Create Goal</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div>
          <label>Title</label>
          <br />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Amount (₹)</label>
          <br />
          <input
            name="targetAmount"
            type="number"
            value={form.targetAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Current Saved (₹)</label>
          <br />
          <input
            name="currentAmount"
            type="number"
            value={form.currentAmount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Deadline</label>
          <br />
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ marginTop: '8px' }}>
          Save Goal
        </button>
      </form>

      <h3>My Goals</h3>
      {goals.length === 0 && <p>No goals yet</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {goals.map((g) => {
          const percent =
            g.targetAmount > 0
              ? Math.round((g.currentAmount / g.targetAmount) * 100)
              : 0;
          const color =
            percent < 50 ? '#4caf50' : percent < 100 ? '#ffa000' : '#f44336';
          const width = percent > 150 ? '150%' : `${percent}%`;
          const deadlineStr = g.deadline
            ? new Date(g.deadline).toISOString().slice(0, 10)
            : 'None';

          return (
            <li
              key={g._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <strong>{g.title}</strong>
                <span>{percent}%</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                ₹{g.currentAmount} / ₹{g.targetAmount} • Deadline: {deadlineStr}
              </div>
              <div
                style={{
                  background: '#eee',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width,
                    height: '100%',
                    background: color,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label>
                  Update saved:{' '}
                  <input
                    type="number"
                    defaultValue={g.currentAmount}
                    onBlur={(e) => handleUpdateAmount(g._id, e.target.value)}
                    style={{ width: '100px' }}
                  />
                </label>
                <button onClick={() => handleDelete(g._id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
