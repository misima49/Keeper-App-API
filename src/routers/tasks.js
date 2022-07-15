const express = require("express");
const auth = require('../middlewares/auth');
const Task = require("../models/Task");

const router = new express.Router();

// Get all tasks for the user
// Filter using /?completed={true, false}
// Limit results using /?skip=#&limit=#
// Sort using /?sortBy={createdAt:desc, createdAt:asc}
router.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};

	if(req.query.completed) {
		match['completed'] = req.query.completed;
	}

	if(req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}

	try {
		await req.user.populate({
			path: 'userTasks',
			match,
			options: {
				skip: req.query.skip,
				limit: req.query.limit,
				sort,
			}
		});
		const tasks = req.user.userTasks;

		res.send(tasks);
	} catch (err) {
		console.log(err);
		res.status(500).send({ err })
	}
	
});

// Get a single task by id
router.get("/tasks/:id", auth, async (req, res) => {
	let _id = req.params.id;

	try {
		const task = await Task.findOne({ _id, owner: req.user._id });
		if(!task) {
			res.status(404).send('Task not found');
		}

		res.send(task);
	} catch (err) {
		res.status(500).send({ err });
	}
});

// Insert task to current user
router.post("/tasks", auth, async (req, res) => {
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id,
		});
	
		await task.save();
		res.send(task);
	} catch(err) {
		res.status(500).send({ err });
	}
});

// Update task details
router.patch("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const validUpdateReqs = ["completed", "description"];
	const updateReq = Object.keys(req.body);

	const isValidReq = updateReq.every((update) =>
		validUpdateReqs.includes(update)
	);

	if (!isValidReq) {
		return res.status(400).send({ error: "Invalid update field!" });
	}

	try {
		const task = await Task.findOne({ _id, owner: req.user._id});
		if (!task) {
			return res.status(404).send("Task not found");
		}

		updateReq.forEach((key) => {
			task[key] = req.body[key];
		});

		await task.save();

		res.send(task);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// Delete a task for the user
router.delete('/tasks/delete/:id', auth, async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findOne({ _id, owner: req.user._id });

		if(!task) {
			return res.status(404).send('Task not found!!');
		}

		await task.remove();
		res.send(task);
	} catch (err) {
		res.status(500).send( { err } );
	}
});

module.exports = router;
