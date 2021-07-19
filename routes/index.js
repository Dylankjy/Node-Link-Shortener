// Environment variables
const config = require('../config')

// Express
const express = require('express')
const router = express.Router()
const { check } = require('express-validators')

// MongoDB
const { MongoClient } = require('mongodb')
const url = config.mongo.host
const dbName = config.mongo.db
const collection = config.mongo.collection

const uuid = require('uuid')
const short = require('short-uuid')

// Database wrapper
const { insertDB, findDB } = require('../app/db')

// MongoDB sanitize
const sanitize = require('mongo-sanitize')

// Cookie Options
const CookieOptions = {
    httpOnly: true,
    // domain: `.${config.app.host}:${config.app.port}`,
    maxAge: 5000,
    path: '/',
}

router.get('/', [check(req.cookies.shortenedLink).isLength({ max: 7 }).trim().escape()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send('Bad Request')
    }

    const metadata = {
        app: {
            name: config.app.name,
            domain: config.app.publicAccessableDomain,
        },
        data: {
            shortenedLink: req.cookies.shortenedLink,
        },
    }
    res.render('index', metadata)
})

router.post('/', (req, res) => {
    // Get the post data
    const { urlToShort } = req.body

    const CreateSchema = {
        'url': sanitize(urlToShort),
        'short': short().fromUUID(uuid.v1()).substring(0, 7), // Generate a new UUID using v1 and only use the first 6 characters
    }

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err
        const db = client.db(dbName)

        findDB(db, collection, { url: CreateSchema.url }, (data) => {
            // If there's already an existing shortened link for this url, use that instead of creating a new one.
            if (data.length !== 0) {
                // Set the cookie to the existing shortened link
                // Rationale behind why we use a cookie is to prevent the "Form resubmission" prompt from occurring if the user decides to refresh.
                res.cookie('shortenedLink', data[0].short, CookieOptions)

                // Redirect to the index page
                client.close()
                return res.redirect('/')
            }

            // Else, create a new shortened link.
            return insertDB(db, collection, CreateSchema, () => {
                // Set the cookie to the new shortened link
                res.cookie('shortenedLink', CreateSchema.short, CookieOptions)

                console.log(`\x1b[1m\x1b[2m[DATABASE] - \x1b[1m\x1b[35mCREATE\x1b[0m: ${CreateSchema.short} = ${CreateSchema.url}\x1b[0m`)

                // Redirect to the index page
                client.close()
                return res.redirect('/')
            })
        })
    })
})

// Router export
module.exports = router
