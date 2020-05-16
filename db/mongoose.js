const mongoose = require('mongoose');

//db connection
mongoose.connect(
  'mongodb+srv://dm:ShekharM1@@cluster0-ugtsv.mongodb.net/test?retryWrites=true&w=majority',
  {
	useNewUrlParser: true,
	useUnifiedTopology: true
  },
)
.then(() => console.log('DB Connected'))