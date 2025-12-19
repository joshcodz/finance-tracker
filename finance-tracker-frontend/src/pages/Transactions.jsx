import { useEffect, useMemo, useState } from 'react';

export default function Transactions() {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    note: '',
  });
  const [transactions, setTransactions] = useState([]);

  // date filter state
  const [filterType, setFilterType] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const token = localStorage.getItem('token');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function fetchTransactions() {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to load transactions');
        return;
      }
      setTransactions(data);
    } catch (err) {
      console.error('Fetch transactions error:', err);
      alert('Error loading transactions');
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to add transaction');
        return;
      }

      setForm({
        type: 'expense',
        amount: '',
        category: '',
        date: '',
        note: '',
      });
      fetchTransactions();
    } catch (err) {
      console.error('Create transaction error:', err);
      alert('Error adding transaction');
    }
  }

  // ---------- DATE FILTER LOGIC ----------
  function getDateRange() {
    const now = new Date();
    if (filterType === 'thisMonth') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: first, end: last };
    }
    if (filterType === 'lastMonth') {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: first, end: last };
    }
    if (filterType === 'custom' && startDate && endDate) {
      return { start: new Date(startDate), end: new Date(endDate) };
    }
    return { start: null, end: null };
  }

  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRange();
    if (!start || !end) return transactions;

    return transactions.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  }, [transactions, filterType, startDate, endDate]);

  return (
    <div style={{ padding: '16px' }}>
      <h2>Transactions</h2>

      {/* Date Filters */}
      <div
        style={{
          marginBottom: '16px',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <strong>Date Filter:</strong>{' '}
        <button
          type="button"
          onClick={() => setFilterType('thisMonth')}
          style={{
            marginRight: '8px',
            fontWeight: filterType === 'thisMonth' ? 'bold' : 'normal',
          }}
        >
          This Month
        </button>
        <button
          type="button"
          onClick={() => setFilterType('lastMonth')}
          style={{
            marginRight: '8px',
            fontWeight: filterType === 'lastMonth' ? 'bold' : 'normal',
          }}
        >
          Last Month
        </button>
        <button
          type="button"
          onClick={() => setFilterType('custom')}
          style={{
            marginRight: '8px',
            fontWeight: filterType === 'custom' ? 'bold' : 'normal',
          }}
        >
          Custom
        </button>
        {filterType === 'custom' && (
          <span style={{ marginLeft: '8px' }}>
            From:{' '}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />{' '}
            To:{' '}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </span>
        )}
      </div>

      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type</label>
          <br />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label>Amount</label>
          <br />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <br />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <br />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Note</label>
          <br />
          <input name="note" value={form.note} onChange={handleChange} />
        </div>

        <button type="submit" style={{ marginTop: '8px' }}>
          Add
        </button>
      </form>

      <h3 style={{ marginTop: '24px' }}>My Transactions</h3>
      <ul>
        {filteredTransactions.map((t) => (
          <li key={t._id}>
            {t.date?.slice(0, 10)} – {t.type} – {t.category} – ₹{t.amount}
          </li>
        ))}
        {filteredTransactions.length === 0 && <p>No transactions in range</p>}
      </ul>
    </div>
  );
}
  