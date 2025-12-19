import { useEffect, useState } from 'react';

export default function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '' });

  const token = localStorage.getItem('token');

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function fetchBudgets() {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/budgets?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to load budgets');
        return;
      }
      setBudgets(data);
    } catch (err) {
      console.error('Fetch budgets error:', err);
      alert('Error loading budgets');
    }
  }

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert('Please login first');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: form.category,
          amount: Number(form.amount),
          month,
          year,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to save budget');
        return;
      }
      setForm({ category: '', amount: '' });
      fetchBudgets();
    } catch (err) {
      console.error('Create budget error:', err);
      alert('Error saving budget');
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <h2>Budgets</h2>

      <div style={{ marginBottom: '16px' }}>
        <label>
          Month:{' '}
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </label>{' '}
        <label>
          Year:{' '}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
      </div>

      <h3>Add / Update Budget</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div>
          <label>Category</label>
          <br />
          <input
            name="category"
            value={form.category}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label>Amount (₹)</label>
          <br />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleFormChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '8px' }}>
          Save Budget
        </button>
      </form>

      <h3>Budgets for {month}/{year}</h3>
      <ul>
        {budgets.map((b) => (
          <li key={b._id}>
            {b.category}: ₹{b.amount}
          </li>
        ))}
        {budgets.length === 0 && <p>No budgets set yet</p>}
      </ul>
    </div>
  );
}
