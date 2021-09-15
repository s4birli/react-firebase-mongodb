const router = require('express').Router()
const playersController = require('../controllers/player.controller')

//admin
router.post('/', playersController.addNewPlayer)
router.get('/', playersController.getAllPlayers)
router.get('/players', playersController.getNoneAssignedPlayers)
router.put('/', playersController.update)
router.delete('/:id', playersController.delete)

module.exports = router
