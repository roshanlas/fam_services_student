const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const server = express();
const passport = require('passport');
const keys = require('./config/keys');

 const runServer = async () => {
    const port = process.env.PORT || 3011;
    let dbUrl;
    
    if (process.env.NODE_ENV == "test") {
        dbUrl = global.__MONGO_URI__;
        console.log('test is', dbUrl)
        global.domain = "http://localhost:" + port
    } else {
        dbUrl = keys.mongoURI;
    }

   console.log(dbUrl)
    // // Connect to mongo with mongoose
    await mongoose
        .connect(dbUrl, { useNewUrlParser: true })
        .then(()=> console.log("Db Connected"))
        .catch(err => console.log(err));

    // Configure express to read body from a POST request
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(cors());

    // Init passportjs
    server.use(passport.initialize());
    // Import the function from file the and invoke immediately
    require('./config/passport')(passport);

    const storyRoutes = require('./routes/Submission');
    
    server.use('/submission', passport.authenticate('jwt', {session:false}), storyRoutes);
    
    const profileRoutes = require('./routes/Profile');
    server.use('/profile', passport.authenticate('jwt', {session:false}), profileRoutes);

    const authRoutes = require('./routes/Auth');
    server.use('/', authRoutes);

    // If port is specified, user it. Otherwise default to 5000
    server.set('port', port);
    // Connect to the port.
    await server.listen(port, () => console.log(`Your application is running @ http://localhost:${port}`));
    return server;
 }

module.exports = runServer;