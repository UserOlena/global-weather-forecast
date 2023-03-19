// reference to the "search" button element
const searchBtnEl = $('#search-btn');
// retrieve the input value that has been entered into the search field
const searchInputEl = $('#search-input').val();

// when the "search" button is clicked, call the function to obtain the latitude and longitude values for the selected city
searchBtnEl.click(function(event) {
    
    event.preventDefault()
    // API to get the lat and lon values based on the entered city
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInputEl}&limit=1&appid=${openWeatherMapApi}`) 
    .then(response => response.json())
    .then(data => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(lat, lon)

        getWeather(lat, lon);
        })
})

// function to retrieve the current weather data
const getWeather = (lat, lon) => {

    fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.name)
        console.log(data.main.temp)
        console.log(data.main.temp_min)
        console.log(data.main.temp_max)
        console.log(data.main.humidity)
        console.log(data.wind.speed)
    })
}

// 5 days forecast API
//fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
