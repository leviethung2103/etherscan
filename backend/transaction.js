// nodemon transaction.js 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
console.log(process.env.PORT);
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transactions_db';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transactionSchema = new mongoose.Schema({
  hash: String,
  block_number: Number,
  block_timestamp: Date,
  from_address: String,
  to_address: String,
  value: Number,
  gas_price: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API endpoint to get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ block_timestamp: -1 });
    console.log(transactions);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// API endpoint to get rapid transactions
const fs = require('fs');
const path = require('path');

app.get('/api/rapid-transactions', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'rapid_transactions.json');
    console.log('filepath',filePath);

    const rapidTransactions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(rapidTransactions);
    res.json(rapidTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rapid transactions', error });
  }
});
