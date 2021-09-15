
const router = require('express').Router()
const authController = require('../controllers/auth.controller')


router.post('/login', authController.loginAction)

module.exports = router
