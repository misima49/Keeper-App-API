const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require('./Task');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},

	password: {
		type: String,
		trim: true,
		required: true,
		minLength: [7, "Password length too small."],
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password cannot contain 'password'");
			}
		},
	},

	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Invalid email address");
			}
		},
	},

	age: {
		type: Number,
		default: 0,
		min: [0, "Age value to cannot be negative"],
	},

	tokens: [
		{
			token: {
				type: String,
				require: true,
			},
		},
	],
});

userSchema.virtual('userTasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
	const user = this

	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens

	return userObject
}

userSchema.methods.generateAuthToken = async function () {
	const user = this
	const token = jwt.sign(
		{ _id: user._id.toString() },
		process.env.JWT_ENCRYPT_KEY
	)

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

userSchema.statics.findByCreds = async function (email, password) {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid credentials!!");
	}
	const isValidCreds = await bcrypt.compare(password, user.password);
	if (!isValidCreds) {
		throw new Error("Invalid credentials!!");
	}

	return user;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

userSchema.pre('remove', async function (next) {
	const user = this;
	try {
		await Task.deleteMany({ owner: user._id });
		next();
	} catch (err) {
		throw new Error(err);
	}
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
