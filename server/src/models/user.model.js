const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },
}, {
    timestamps: true,
    strict: false,
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
        }
    },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.pro
            delete ret.password
        }
    }
})

UserSchema.index({
    '$**': 'text'
})

UserSchema.plugin(require('mongoose-autopopulate'))

UserSchema.post('init', function (doc) {
    console.log('%s has been initialized from the db', doc._id)
})

UserSchema.post('remove', function (doc) {
    console.log('%s has been removed', doc._id)
})

// hashing a password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this
    try {
        if (this.isNew) {
            user.password = await hashPassword(user.password)
        }
        next()
    } catch (err) {
        next(err)
    }
})

UserSchema.statics.hashPassword = (password, salt) => hashPassword(password, salt)

const hashPassword = (password, saltRounds = 10) => bcrypt.hash(password, saltRounds)

UserSchema.statics.findByEmail = async function (email) {
    return await this.model('User').findOne({ email })
        .exec()
}

UserSchema.statics.confirmUserEmail = async function (email) {
    const user = await this.model('User').findOne({ email })
        .exec()
    if (!user) { throw new Error('user not found') }
    // if (user.activated && user.email_validated) { throw new Error('user already activated') }
    user.activated = true
    user.email_validated = true
    return await user.save()
}

UserSchema.virtual('id').get(function () {
    const user = this
    return user._id
})

module.exports = mongoose.model('User', UserSchema)
