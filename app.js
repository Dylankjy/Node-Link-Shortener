// Environment variables
const config = require('./config')

// Express related modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Express: Routes
const routes = {
    index: require('./routes/index'),
    redirects: require('./routes/shorturlRedirect'),
}

// Express: Public Directory
app.use('/', express.static('public'))
app.use('/third_party', express.static('third_party'))

// Handlebars: Render engine
app.set('view engine', 'hbs')

// Handlebars: Views folder
app.set('views', [`views`])

// Handlebars: Environment options
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: `views/layouts`,
}))

const webserver = () => {
    // For creation GUI
    app.use('/', routes.index)

    // For short url redirects
    app.use('/', routes.redirects)

    return app.listen(config.app.port, () => {
        console.log(`\x1b[1m\x1b[2m[WEBSERVER] - \x1b[1m\x1b[34mOK\x1b[0m: Webserver binded on port ${config.app.port} | http://${config.app.publicAccessableDomain}\x1b[0m`)
    })
}

webserver()
