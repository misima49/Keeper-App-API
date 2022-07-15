const express = require("express");
const User = require("../models/User");
const { sendWelcomeEmail, sendSeparationEmail } = require('../emails/account');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Get logged in user's profile
router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);	
});


// Register new user
router.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		sendWelcomeEmail(user.email, user.name);

		res.status(201).send({ user, token });
	} catch (err) {
		console.log(err);
		res.status(400).send({ error: "Unable to create user!!", err });
	}
});

// Login user
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCreds(req.body.email, req.body.password);
		const token = await user.generateAuthToken();

		res.send({ user, token });
	} catch (err) {
		console.log(err);
		res.status(400).send({ error: "Couldn't Login!!", err });
	}
});

// Logout user from current device
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter( token => token.token !== req.token )

		await req.user.save()
		res.send('Succesfully logged out.')
	} catch(err) {
		res.status(500).send({ err })
	}
});

// Logout user from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()

		res.send('Successfully logged out from all devices.')
	} catch (err) {
		res.status(500).send({ err })
	}
});

// Update data for logged in user
router.patch("/users/me", auth, async (req, res) => {
	const _id = req.user._id
	const validUpdateReqs = ["name", "age", "password"]
	const updateReq = Object.keys(req.body)

	const isValidReq = updateReq.every((update) =>
		validUpdateReqs.includes(update)
	)

	if (!isValidReq) {
		return res.status(400).send({ error: "Invalid update field!" });
	}

	try {
		updateReq.forEach((key) => {
			req.user[key] = req.body[key];
		});

		await req.user.save();

		res.send(req.user);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Delete logged in user
router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove()
		sendSeparationEmail(req.user.email, req.user.name);

		res.send(req.user)
	} catch (err) {
		res.status(500).send({ err })
	}
});

module.exports = router;
