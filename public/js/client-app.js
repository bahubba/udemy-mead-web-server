const weatherForm = document.querySelector('#weather-form')
const locationSearch = document.querySelector('#location-search')
const locationMsg = document.querySelector('#location-p')
const forecastMsg = document.querySelector('#forecast-p')

weatherForm.onsubmit = e => {
    e.preventDefault()
    const location = locationSearch.value

    locationMsg.textContent = forecastMsg.textContent = 'Loading...'

    fetch('/weather?location=' + location)
    .then(rsp => {
        rsp.json()
            .then(data => {
                if(data.error) {
                    console.log('Couln\'t find weather')
                    console.log(data.error)
                } else {
                    locationMsg.textContent = data.location
                    forecastMsg.textContent = 'It is ' + data.weatherDesc[0].toLowerCase() + '. The current temperature is ' + 
                        data.temperature + '\u00B0F. It feels like ' + data.feelsLike + '\u00B0F.'
                }
            })
    })
}