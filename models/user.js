const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true
	}, 
	password: {
		type: String,
		required: true,
		trim: true
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		}
	}]
}, { timestamps: true });

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisIsTest')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('No email in DB')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid credentials')
    }
    return user
}

userSchema.pre('save', async function(next){
	const user = this;
	if(user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next();
})

module.exports = mongoose.model('User', userSchema);