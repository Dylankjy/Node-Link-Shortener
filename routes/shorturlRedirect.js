// Environment variables
const config = require('../config')

// Express
const express = require('express')
const router = express.Router()

// MongoDB
const { MongoClient } = require('mongodb')
const url = config.mongo.host
const dbName = config.mongo.db
const collection = config.mongo.collection

// Database wrapper
const { findDB } = require('../app/db')

// MongoDB sanitize
const sanitize = require('mongo-sanitize')

router.get('/:shorturl', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err
        const db = client.db(dbName)

        findDB(db, collection, { short: sanitize(req.params.shorturl) }, (data) => {
            if (data.length === 0) {
                return res.status(404).send('Not Found')
            }

            console.log(`\x1b[1m\x1b[2m[WEBSERVER] - \x1b[1m\x1b[32mREDIRECT\x1b[0m: ${config.app.publicAccessableDomain}/${data[0].short} --> ${data[0].url}\x1b[0m`)

            res.redirect(data[0].url)
        })
    })
})

// Router export
module.exports = router
