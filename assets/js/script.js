const date = dayjs().format('ddd, MMM D, YYYY H:mm A');
const searchBtnEl = $('#search-btn'); // reference to the "search" button element

let searchInputEl = $('#search-input'); 
searchInputEl.val('');

// when the "search" button is clicked, call the function to obtain the latitude and longitude values for the selected city
searchBtnEl.click(function(event) {
    
    searchInputEl = $('#search-input').val(); // retrieve the input value that has been entered into the search field
    
    event.preventDefault()
    // API to get the lat and lon values based on the entered city
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInputEl}&limit=1&appid=${openWeatherMapApi}`) 
    .then(response => response.json())
    .then(data => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const cityName = data[0].name;

        getCurrentWeather(lat, lon);
        saveSearchHistory(cityName, lat, lon)
        
        })
})

// function to retrieve the current weather data
const getCurrentWeather = (lat, lon) => {

    $("#left-side").text('');
    $("#current-weather-values").text('');
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        $("#left-side").append(`<li id="city-name">${data.name}, ${data.sys.country}</li>`); // city name
        $('#left-side').append(`<li id="weather-condition">${data.weather[0].main}</li>`); // weather condition (clouds/rainy etc)
        $('<img>', {
            src: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, // weather icon
            alt: 'weather image'
        }).appendTo('#left-side')
        
        
        $("#current-weather-values").append(`<li id="date">${date}</li>`); // current date
        $('#current-weather-values').append(`<li>temp: <span class="weather-value">${data.main.temp} &#8457;</span></li>`); // current temperature
        $('#current-weather-values').append(`<li>wind: <span class="weather-value">${data.wind.speed} mph</span></span></li>`); // current wind speed 
        $('#current-weather-values').append(`<li>humidity: <span class="weather-value">${data.main.humidity}%</span></li>`); // current humidity
        console.log(data.main.temp_min)
        console.log(data.main.temp_max)
    });
    
    getForecast(lat, lon)
}

// function to retrieve the 5 day forecast weather data
const getForecast = (lat, lon) => {

    $('#forecast-container').text('');
    
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {

        const i = [4, 12, 20, 28, 36];
        
        i.forEach(function(i) {

            let dayOfWeek = dayjs(data.list[i].dt_txt).format('ddd, MMM D');
            let weatherIcon = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png` 
            
            $('<ul>', {
                class: 'forecast-list',
                id: `index-${i}`,
            }).appendTo('#forecast-container');

            $(`#index-${i}`).append(`<li class="week-day">${dayOfWeek}</li>`);
            $(`#index-${i}`).append(`<li class="forecast-item"><img src="${weatherIcon}" alt="weather image"></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">temp: <span class="weather-value">${data.list[i].main.temp} &#8457;</span></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">wind: <span class="weather-value">${data.list[i].wind.speed} mph</span></span></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">humidity: <span class="weather-value">${data.list[i].main.humidity}%</span></li>`);
        })
        
    })   

}

