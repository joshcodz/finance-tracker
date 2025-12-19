// server.js
import dotenv from "dotenv";
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const Goal = require('./models/Goal'); // add with other models


const app = express();

// ====== DB CONNECT ======
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// ====== AUTH MIDDLEWARE ======
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; // "Bearer token"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // make available to routes
    next();
  } catch (err) {
    console.error('AUTH ERROR:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ====== AUTH ROUTES ======

// REGISTER
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== TRANSACTION ROUTES (PROTECTED) ======

// Create transaction
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;

    const tx = await Transaction.create({
      userId: req.userId,
      type,
      amount,
      category,
      date,
      note,
    });

    res.status(201).json(tx);
  } catch (err) {
    console.error('CREATE TX ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions for logged-in user
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(txs);
  } catch (err) {
    console.error('GET TX ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== BUDGET ROUTES (PROTECTED) ======

// Get budgets for a given month/year
app.get('/api/budgets', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = Number(month);
    const y = Number(year);
    if (!m || !y) {
      return res.status(400).json({ message: 'month and year are required' });
    }

    const budgets = await Budget.find({
      userId: req.userId,
      month: m,
      year: y,
    });

    res.json(budgets);
  } catch (err) {
    console.error('GET BUDGETS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update a budget for a category in a month
app.post('/api/budgets', authMiddleware, async (req, res) => {
  try {
    const { category, month, year, amount } = req.body;
    if (!category || !month || !year || !amount) {
      return res
        .status(400)
        .json({ message: 'category, month, year, amount required' });
    }

    const m = Number(month);
    const y = Number(year);
    const a = Number(amount);

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, category, month: m, year: y },
      { amount: a },
      { new: true, upsert: true }
    );

    res.status(201).json(budget);
  } catch (err) {
    console.error('POST BUDGET ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== GOAL ROUTES (PROTECTED) ======

// Get all goals for logged-in user
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error('GET GOALS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new goal
app.post('/api/goals', authMiddleware, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline } = req.body;
    if (!title || !targetAmount) {
      return res
        .status(400)
        .json({ message: 'title and targetAmount are required' });
    }

    const goal = await Goal.create({
      userId: req.userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error('POST GOAL ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update currentAmount (and optionally title/target/deadline)
app.put('/api/goals/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (targetAmount !== undefined) update.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) update.currentAmount = Number(currentAmount);
    if (deadline !== undefined)
      update.deadline = deadline ? new Date(deadline) : null;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (err) {
    console.error('PUT GOAL ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a goal
app.delete('/api/goals/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error('DELETE GOAL ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ====== TEST ROUTE ======
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running');
});

// ====== START SERVER ======
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
