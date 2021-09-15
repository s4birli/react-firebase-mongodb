const router = require('express').Router()
const teamsController = require('../controllers/team.controller')

//admin
router.post('/', teamsController.add)
router.get('/', teamsController.index)
router.put('/', teamsController.update)
router.delete('/:id', teamsController.delete)

module.exports = router
