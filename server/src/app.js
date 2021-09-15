const path = require('path')
const helmet = require('helmet')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config')
const routes = require('./routes')
const app = express()
const cors = require('cors');

app.use(helmet())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, '../', 'public')))
app.set('trust proxy', 1) // trust first proxy


app.use(cors());

app.use((req, res, next) => {
    if (!req.headers.origin) {
        req.headers.origin = req.protocol + '://' + req.get('host')
    }
    next()
})

app.get('/', (req, res) => {
    return res.end('api live')
})

app.use(config.api_path, routes)

app.get('*', (req, res, next) => {
    return res.status(404).end('Page Not Found')
})

app.use((err, req, res, next) => {
    const isError = err instanceof Error
    const code = err.code || err.statusCode || 200
    const error = {
        code,
        name: err.name || 'Error',
        message: isError ? err?.message : err
    }
    return res.json({ success: false, error, isError })
})

module.exports = app
