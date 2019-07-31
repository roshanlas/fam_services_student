const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const server = express();
const keys = require('./config/keys');
const routes = require('./routes/all');

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
    server.use('/', routes);

    // If port is specified, user it. Otherwise default to 5000
    server.set('port', port);
    // Connect to the port.
    await server.listen(port, () => console.log(`Your application is running @ http://localhost:${port}`));
    return server;
 }

module.exports = runServer;