const User = require('../').User;

const mongoose = require('mongoose')
const config = require('../../config')

mongoose.Promise = global.Promise // set mongo up to use promises
mongoose.set('debug', true)

mongoose.connect(config.db.mongo_location, { useCreateIndex: true, useNewUrlParser: true })
    .catch(() => {
        throw new Error('*** Can Not Connect to Mongo Server:' + config.db.mongo_location)
    })

const db = mongoose.connection
db.once('open', () => {
    User.create({email: 'demo@example.com', password: 'demo#123'}).then(() => {
        console.log('Created');
        process.exit(0);
    })
})
