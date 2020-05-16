const express = require('express');
require('./db/mongoose');
const Task = require('./models/task');

const app = express();
app.use(express.json());

// create task
app.post('/tasks',(req, res)=> {
	const task = new Task(req.body);
	task.save()
	.then((task) => res.json({task}))
	.catch(error => res.send(error));
	
	/* try {
		task.save()
		res.json({task})
	} catch(e) {
		e => res.send(e)
	} */
})

// get all task
app.get('/tasks',(req, res)=> {
	Task.find()
	.then(tasks => res.json({tasks}))
	.catch(error => res.send(error));
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
	Task.deleteOne({_id})
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



app.listen(3000, () => console.log(`API is listening on port: 3000`));