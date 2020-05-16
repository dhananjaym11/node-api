var jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	try {	
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'thisIsTest');
		const user = await User.findOne({_id:decoded._id, 'tokens.token': token});
		if(!user) {
			throw new Error('Authorization failed');
		}
		req.user = user;
		req.token = token;
		next();
	} catch(e) {
		res.send(e.message)
	}
}

module.exports = auth;