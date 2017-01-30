let db = new Object();

if (process.env.MONGODB) {
    db.url = process.env.MONGODB;
}
else db.url = 'mongo:27017/babble';

module.exports = db;
