const express = require('express')
const router = express.Router()
const config = require('../config')
const authRoutes = require('./auth.routes')
const playerRoutes = require('./player.routes')
const teamRoutes = require('./team.routes')

router.use('/auth', authRoutes)
router.use('/player', playerRoutes)
router.use('/team', teamRoutes)

router.get('/', function (req, res, next) {
    return res.end('api routes home')
})

if (!config.isProd) {

    router.get('/db', function (req, res, next) {
        return res.end(config.db.mongo_location)
    })

    router.get('/log', async function (req, res, next) {
        const date = new Date()
        const log = {
            level: 'debug',
            time: date.getTime(),
            host: req.get('host')
        }
        await logger.debug(log)
        return res.json(log)
    })

    router.get('/config', function (req, res, next) {
        return res.json({
            success: true,
            data: {
                config
            }
        })
    })
}

module.exports = router
