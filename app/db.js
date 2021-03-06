// From TanukiHQ's Genkan, Licensed under GPLv3.
// Source: https://github.com/TanukiHQ/Genkan/blob/main/genkan/db.js

insertDB = function(db, coll, docs, callback) {
    // Get the documents collection
    const collection = db.collection(coll)
    // Insert some documents
    collection.insertMany([
        docs,
    ], (err, result) => {
        if (err) throw err
        callback(result)
    })
}

updateDB = function(db, coll, query, ops, callback) {
    // Get the documents collection
    const collection = db.collection(coll)
    // Update document where a is 2, set b equal to 1
    collection.updateOne(query, ops, (err, result) => {
        if (err) throw err
        callback(result)
    })
}

findDB = function(db, coll, query, callback) {
    // Get the documents collection
    const collection = db.collection(coll)
    // Find some documents
    collection.find(query).toArray((err, docs) => {
        if (err) throw err
        callback(docs)
    })
}

deleteDB = function(db, coll, query, callback) {
    // Get the documents collection
    const collection = db.collection(coll)
    // Find some documents
    collection.deleteOne(query, (err, result) => {
        if (err) throw err
        callback(true)
    })
}

deleteManyDB = function(db, coll, query, callback) {
    // Get the documents collection
    const collection = db.collection(coll)
    // Find some documents
    collection.deleteMany(query, (err, result) => {
        if (err) throw err
        callback(true)
    })
}

module.exports = {
    insertDB,
    updateDB,
    findDB,
    deleteDB,
    deleteManyDB,
}
