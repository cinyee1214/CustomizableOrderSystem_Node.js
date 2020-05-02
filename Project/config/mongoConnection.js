const MongoClient = require('mongodb').MongoClient;
const settings = {
    mongoConfig: {
        serverUrl: 'mongodb://localhost:27017/',
        database: 'Customizable_meal_ordering_system'
    }
};


const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async() => {
    if (!_connection) {
<<<<<<< HEAD
        _connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true, useUnifiedTopology: true });
=======
<<<<<<< HEAD
        _connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true, useUnifiedTopology: true });
=======
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {useNewUrlParser: true, useUnifiedTopology: true});
>>>>>>> 24b35e3e78576cb20478683cadca5b191ed99b85
>>>>>>> b43f8edfd83149a4f36f630856054774b01fd99a
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
};