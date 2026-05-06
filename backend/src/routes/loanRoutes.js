const router = require('express').Router()
const ctrl = require('../controllers/loanController')
const { verifyToken, isSignatory } = require('../middleware/auth')

router.use(verifyToken)

router.get('/', ctrl.getLoans)
router.post('/', ctrl.requestLoan)

// these need to be before /:id routes so express doesnt match "repayments" as an id
router.get('/repayments', ctrl.getAllRepayments)
router.put('/repayments/:repayId/approve', isSignatory, ctrl.approveRepayment)

router.put('/:id/approve', isSignatory, ctrl.approveLoan)
router.put('/:id/reject', isSignatory, ctrl.rejectLoan)
router.post('/:id/repayments', ctrl.makeRepayment)
router.get('/:id/repayments', ctrl.getRepayments)

module.exports = router
