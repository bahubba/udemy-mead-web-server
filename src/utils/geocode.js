const request = require('request')

const mapboxURLPrefix = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const mapboxURLSuffix = '.json?limit=1&access_token=pk.eyJ1IjoiYmFodWJiYSIsImEiOiJja201bXhqZ2gwZzA2Mm9ydG15eXBjeHFpIn0.0ntj-ku7wSDJBwlx2LTzmg'

const geocode = (address, callback) => {
    request({
        url: mapboxURLPrefix + encodeURIComponent(address) + mapboxURLSuffix,
        json: true
    }, (error, {body: {features}}) => {
        if(error) {
            callback(error, {errTxt: "UNABLE TO CONNECT TO GEOCODING SERVICE!"})
        } else if(!features || features.length === 0) {
            callback("Try another search.", {errTxt: "Unable to find location!"})
        } else {
            callback(null,{
                lat: features[0].center[1],
                lon: features[0].center[0],
                location: features[0].place_name
            })
        }
    })
}

module.exports = geocode