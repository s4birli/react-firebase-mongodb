const jwt = require('jsonwebtoken')
const config = require('../config')
const Errors = require('../utils/errors')
const Messages = require('../utils/messages')
const User = require('../models').User

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,16}$/ //min 4, max 8

exports.loginAction = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        const expirationTimeSeconds = Date.now() + 1000 * 60 * 60 * 24 * 10
        const token = jwt.sign({
            exp: Math.floor(expirationTimeSeconds / 1000), // 10days (seconds)
            uid: user._id
        },
            config.jwt.encryption
        )

        // Adds a new cookie to the response
        return res.cookie('token',
            token, {
            expires: new Date(expirationTimeSeconds), // 10days (milliseconds)
            httpOnly: true,
            // secure: !!config.isProd,
            sameSite: false
        }
        ).json({
            result: true,
            token: {
                access_token: token,
                expires_in: new Date(expirationTimeSeconds),
                token_type: 'bearer'
            }
        })

    } catch (error) {
        console.log(error);
        res.status(505).json({ error: error.message });
    }
}

exports.logoutAction = async (req, res, next) => {
    req.logout()
    return res
        .cookie('token',
            null, {
            maxAge: 0,
            httpOnly: true
        }
        ).json({
            success: true,
            data: 'logged out'
        })
}

exports.confirmEmailTokenAction = async (req, res, next) => {
    const { token } = req.params
    try {
        const decoded = await jwt.verify(token, config.jwt.encryption)
        if (!decoded.email) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
        const updated = await User.confirmUserEmail(decoded.email)
        return res.json({
            success: true,
            data: updated
        })
    } catch (err) {
        return next(err)
    }
}