const router = require('express').Router()
const { createGroup, joinGroup, getMyGroup, getMyGroups, switchGroup } = require('../controllers/groupController')
const { verifyToken } = require('../middleware/auth')

router.use(verifyToken)

router.post('/', createGroup)
router.post('/join', joinGroup)
router.get('/mine', getMyGroup)
router.get('/my-groups', getMyGroups)
router.post('/switch', switchGroup)

module.exports = router
