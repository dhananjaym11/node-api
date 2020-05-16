const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

//db connection
mongoose.connect(
  'mongodb+srv://dm:ShekharM1@@cluster0-ugtsv.mongodb.net/test?retryWrites=true&w=majority',
  {
	useNewUrlParser: true,
	useUnifiedTopology: true
  },
)
.then(() => console.log('DB Connected'))

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		trim: true
	}, 
	completed: {
		type: Boolean,
		default: false
	}
});

app.post('/users',(req, res)=> {
	console.log(req.body);
	res.send('success')
	//const desc = new Task({  description: 'Des 6' });
	//desc.save()
	//.then(() => res.send('success'))
	//.catch(error => res.send(error));
})

app.listen(3000, () => console.log(`API is listening on port: 3000`));