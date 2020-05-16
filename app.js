const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('./db/mongoose');

const Task = require('./models/task');
const User = require('./models/user');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

const upload = multer({
	dest: 'images',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		// if(!file.originalname.endsWith('.PNG')) {
		if(!file.originalname.match(/\.(png|PNG)$/)) {
			return cb(new Error('FIle must me png'))
		}
		cb(undefined, true);
	}
})

app.post('/upload', (req, res)=> {
	upload.single('upload')(req, res, (err)=> {
		if(err) res.status(400).send({error: err.message});
		res.send('success');
	});
});

/*app.post('/upload', upload.single('upload'), (req, res)=> {
	res.send('success');	
}, (error, req, res) => {
	res.status(400).send('error');
});*/

// create task
app.post('/tasks', auth, (req, res)=> {
	const task = new Task(req.body);
	task.save()
	.then((task) => res.json({task}))
	.catch(error => res.send(error));
	
	/* try {
		task.save()
		res.json({task})
	} catch(e) {
		res.send(e)
	} */
})

// get all task - completed=true&limit=5&page=1&sort=createdAt:desc
app.get('/tasks', auth, async(req, res)=> {
	try {
		const match = {}
		let skip = 0;
		const sort = {}
		
		if(req.query.completed) {
			match.completed = req.query.completed === 'true'
		}
		if(req.query.limit && req.query.page && req.query.page > 0) {
			skip = req.query.limit*(req.query.page-1)
		}
		if(req.query.sort) {
			const sortOpr = req.query.sort.split(':');
			sort[sortOpr[0]] = sortOpr[1] === 'desc' ? '-1' : '1';
		}
		
		const tasks = await Task.find(match)
		.sort(sort)
		.skip(skip)
		.limit(+req.query.limit);
		res.send(tasks);
	} catch(e) {
		res.send(e)
	}
})

// get single task
app.get('/task/:id',(req, res)=> {
	const _id = req.params.id;
	Task.findById(_id)
	.then(task => {
		if(task) return res.json({task});
		res.status(404).send('Id not found')
	})
	.catch(error => res.status(500).send(error));
})

// delete task
app.delete('/task/:id',(req, res)=> {
	const _id = req.params.id;
	Task.findByIdAndDelete(_id)
	.then(task => {
		if(task) return res.json({task});
		res.status(404).send('Id not found')
	})
	.catch(error => res.status(500).send(error));
})

// update task - put full payload
app.put('/task/:id',(req, res)=> {
	const _id = req.params.id;
	const task = req.body;
	Task.findByIdAndUpdate(_id, task)
	.then(task => {
		if(task) return res.json({task});
		res.status(404).send('Id not found')
	})
	.catch(error => res.status(500).send(error));
})

// update task - patch updated payload
app.patch('/task/:id',(req, res)=> {
	const _id = req.params.id;
	const task = req.body;
	const updates = Object.keys(task);
	const allowedUpdate = ['description', 'completed'];
	
	const isValid = updates.every(update => allowedUpdate.includes(update));
	
	if(!isValid) return res.status(404).send('Invalid updates')
	
	Task.findByIdAndUpdate(_id, task)
	.then(task => {
		if(task) return res.json({task});
		res.status(404).send('Id not found')
	})
	.catch(error => res.status(500).send(error));
})

// check password
app.post('/check-password', async(req, res)=> { 
	try {
        await User.findByCredentials(req.body.email, req.body.password)
		res.send('success');
	} catch(e) {
		res.status(400).send(e.message)
	} 
})

// add user
app.post('/users', async (req, res)=> {
    const user = new User(req.body)
    try {
        await user.save()
		const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// get users
app.get('/users', (req, res)=> {
	User.find()
	.then(user => res.json({user}))
	.catch(error => res.send(error));
})

// signin
app.post('/signin', async(req, res)=> {	
	try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch(e) {
		res.send(e.message);
	}
})

// signout
app.post('/signout', auth, async (req, res)=> {
	try {
		req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
		await req.user.save();
		res.send('logged out')
	} catch(e) {
		res.send(e.message);
	}
})

app.listen(3000, () => console.log(`API is listening on port: 3000`));