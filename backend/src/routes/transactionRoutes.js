const express = require('express');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  generateRecurring,
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/generate-recurring', generateRecurring);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
