require('dotenv').config()
// eslint-disable-next-line no-undef
const processEnv = process.env
const env = processEnv.NODE_ENV || 'production'

const db = {
	mongo_location: processEnv.MONGODB_URI || 'mongodb://localhost:27017/teams'
}

const port = processEnv.PORT

module.exports = {
	env,
	db,
	port,
	api_path: '/api',
	whileListDomains: [
		'http://localhost:8080',
		'http://localhost:3000',
		'http://localhost:5000',
	],
	jwt: {
		encryption: processEnv.JWT_ENCRYPTION || 'myS3cr3tK3y',
	}
	
}
