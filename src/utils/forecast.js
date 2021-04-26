const request = require('request')

const weatherStackURLPrefix = 'http://api.weatherstack.com/current?access_key=c230ac9007323a56e78231d25bd831ac&units=f&query='

const forecast = (lat, lon, callback) => {
    request({
        url: weatherStackURLPrefix + lat + ',' + lon,
        json: true
    }, (error, {body: {error: err, current: curr}}) => {
        if(error) {
            callback(error, {errTxt: "UNABLE TO CONNECT TO WEATHER SERVICE!"})
        } else if(err) {
            callback(err, {errTxt: "Unable to find weather for location!"})
        } else {
            callback(null, curr)
        }
    })
}

module.exports = forecast