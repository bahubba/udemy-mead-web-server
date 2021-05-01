// Libs
const dotenv = require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const _ = require('lodash')

// Internal src files
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define port paths for Express config
const port = process.env.PORT || 3000
const publicDir = path.join(__dirname,'../public')
const viewsDir = path.join(__dirname,'../templates/views')
const partialsDir = path.join(__dirname,'../templates/partials')

// Initialize Express App
const app = express()

// Set up Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

// Set up static directory to serve
app.use(express.static(publicDir))

/*
 * Root
 * Weather page
*/
app.get('',(req,rsp) => {
    rsp.render('index', {
        title: 'Weather',
        name: 'Ben Hubbard'
    })
})

/*
 * About page
*/
app.get('/about',(req,rsp) => {
    rsp.render('about', {
        title: 'About',
        imgPath: '/images/P1.jpg',
        name: 'Ben Hubbard'
    })
})

/*
 * Help page
*/
app.get('/help',(req,rsp) => {
    rsp.render('help', {
        title: 'Help',
        name: 'Ben Hubbard',
        helpMessage: 'You need to seek professional help'
    })
})

/*
 * API-like endpoint
 * Return weather data using geocode and forecast
*/
app.get('/weather', (req,rsp) => {
    const locationParam = _.get(req,'query.location')
    
    // Check for location in URL query
    if(!locationParam) {
        return rsp.send({
            error: 'You must provide a location string'
        })
    }

    // Get lat/lon info
    geocode(locationParam, (error, {lat, lon, location, errTxt} = {}) => {
        if(error) {
            return rsp.send({
                error: errTxt,
                details: error
            })
        }

        // Generate forecast
        forecast(lat, lon, (error, { weather_descriptions: weatherDesc, wind_dir: windDir, wind_speed: windSpeed, humidity, temperature, feelslike: feelsLike, errTxt}) => {
            if(error) {
                return rsp.send({
                    error: 'Unable to get forecast',
                    details: error
                })
            }

            // TODO - Reroute/forward to page with data?\
            // Respond with the forecast data
            rsp.send({
                location,
                weatherDesc,
                windDir,
                windSpeed,
                humidity,
                temperature,
                feelsLike
            })
        })
    })
})

/*
 * Help 404
*/
app.get('/help/*', (req,rsp) => {
    rsp.render('404', {
        title: '404 - Not Found',
        errMessage: 'Help article not found.',
        name: 'Ben Hubbard'
    })
})

/*
 * 404
*/
app.get('*', (req,rsp) => {
    rsp.render('404', {
        title: '404 - Not Found',
        errMessage: 'Page not found.',
        name: 'Ben Hubbard'
    })
})

app.listen(port, () => {
    {console.log('Server started on port ' + port)}
})