const path = require('path');
const fs = require('fs');
const MongodbMemoryServer = require('mongodb-memory-server');
const globalConfigPath = path.join(__dirname, 'globalConfig.json');

const mongod = new MongodbMemoryServer.default({
  binary: {
    version: '4.0.3',
    dbName: 'sampledb_test',
    port: '27017'
  },
  autoStart: false,
  debug: false
});

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: 'jest',
    mongoUri: await mongod.getConnectionString()
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  console.log('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env.MONGO_URL = mongoConfig.mongoUri;
};