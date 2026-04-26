const express = require('express');
const {
  getBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getBudgetsController);
router.post('/', createBudgetController);
router.put('/:id', updateBudgetController);
router.delete('/:id', deleteBudgetController);

module.exports = router;
