const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

//DB Config
const db = require('./config/keys').mongoURI;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongooseDB connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);
//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

var gracefulExit = function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection with DB closed:');
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

app.listen(port, () => console.log(`Server is running on port ${port}`));
