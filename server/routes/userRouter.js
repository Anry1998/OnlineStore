const Router = require('express')
const router = new Router
const controller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', controller.reqistration)
router.post('/login', controller.login)
router.get('/auth', authMiddleware, controller.check)


module.exports = router