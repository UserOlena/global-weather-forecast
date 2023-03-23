const date = dayjs().format('ddd, MMM D, YYYY H:mm A');
const searchBtnEl = $('#search-btn'); // reference to the "search" button element
const historyBoxEl = $('<div>').attr('id', 'history-btn-container');

let searchInputEl = $('#search-input'); 
searchInputEl.val('');

// when the "search" button is clicked, call the function to obtain the latitude and longitude values for the selected city
searchBtnEl.click(function(event) {
    
    searchInputEl = $('#search-input').val(); // retrieve the input value that has been entered into the search field
    
    if (!searchInputEl) {
        event.preventDefault();
        modalMessage('empty input value')
    } else {
        event.preventDefault();
        // API to get the lat and lon values based on the entered city
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInputEl}&limit=1&appid=${openWeatherMapApi}`) 
        .then(response => response.json())
        .then(data => {
            if (data.length < 1) {
                console.log('data is undefined')
                modalMessage('wrong city name');
            } else {
                const lat = data[0].lat;
                const lon = data[0].lon;

                getCurrentWeather(lat, lon);
            }       
    
        })
    }

});

// function to retrieve the current weather data
const getCurrentWeather = (lat, lon) => {
    
    $("#left-side").text('');
    $("#current-weather-values").text('');
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const cityName = data.name;
        const country = data.sys.country;
        
        $("#left-side").append(`<li id="city-name">${cityName}, ${country}</li>`); // city name, country code
        $('#left-side').append(`<li id="weather-condition">${data.weather[0].main}</li>`); // weather condition (clouds/rainy etc)
        $('<img>', {
            class: 'weather-icon',
            src: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, // weather icon
            alt: 'weather image'
        }).appendTo('#left-side')
        
        
        $("#current-weather-values").append(`<li id="date">${date}</li>`); // current date
        $('#current-weather-values').append(`<li>temp: <span class="weather-value">${data.main.temp} &#8457;</span></li>`); // current temperature
        $('#current-weather-values').append(`<li>wind: <span class="weather-value">${data.wind.speed} mph</span></span></li>`); // current wind speed 
        $('#current-weather-values').append(`<li>humidity: <span class="weather-value">${data.main.humidity}%</span></li>`); // current humidity
        
        
        saveSearchHistory(cityName, country, lat, lon)        
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
            $(`#index-${i}`).append(`<li class="forecast-item"><img class="weather-icon" src="${weatherIcon}" alt="weather image"></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">temp: <span class="weather-value">${data.list[i].main.temp} &#8457;</span></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">wind: <span class="weather-value">${data.list[i].wind.speed} mph</span></span></li>`);
            $(`#index-${i}`).append(`<li class="forecast-item">humidity: <span class="weather-value">${data.list[i].main.humidity}%</span></li>`);
        })
        
    })   

}


// function that stores search history in the local storage.
const saveSearchHistory = (cityName, country, lat, lon) => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    // an object containing the current city search.
    let newSearchItem = {
        cityName: `${cityName}`,
        country: `${country}`,
        lat: lat,
        lon: lon,
    };

    // an if-statement that verifies whether the current search city already exists in the localStorage and prevents it from being duplicated.
    if (searchHistory.length > 0) {
        for (let i = 0; i < searchHistory.length; i++) {
            if (searchHistory[i].lat == newSearchItem.lat) {
                return;
            }
        }
    };

    searchHistory.push(newSearchItem);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Display modal alert message
function modalMessage(problemType) {
    
    const modalContainer = document.createElement('dialog');
    modalContainer.setAttribute('id', 'modal-box');
    
    const emoji = document.createElement('img');
    emoji.setAttribute('id', 'modal-emoji');
    emoji.setAttribute('src', './assets/img/emoji-idk.png');
    emoji.setAttribute('alt', "I don't know emoji");
    
    const modalMessage = document.createElement('h3');

    if (problemType === 'wrong city name') {
        modalMessage.textContent = 'Sorry, we could not locate the requested city. Please ensure that you have entered the correct city name.'; 
    } else if (problemType === 'empty input value') {
        modalMessage.textContent = 'The input field must not be left empty. Please enter a city name.';    
    }
    
    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.setAttribute('id', 'modal-close-btn');
    modalCloseBtn.textContent = 'dismiss';
    
    modalContainer.append(emoji, modalMessage, modalCloseBtn);
    document.querySelector('body').appendChild(modalContainer);
    
    modalContainer.showModal();

    // Hides modal alert on click "dismiss" button
    modalCloseBtn.addEventListener('click', function() {
      
        modalContainer.close()
    })
}

// function retrieves the search history from local storage and displays the stored data below the input field.
const displayHistorySearch = () => {
    
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    searchHistory.forEach(function(element) {

        historyBtn = $('<button>').attr('class', 'history-btn');
        historyBtn.text(element.cityName);
        historyBoxEl.append(historyBtn);
        
    });
    
    $('aside').append(historyBoxEl);
}


// The event listener captures the selected button and its city name text content, 
// and subsequently passes latitude and longitude values corresponding to the chosen city name to the getCurrentWeather().
historyBoxEl.click(function (event) {

    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    let chosenButtonTextContent = event.target.textContent;
    console.log(chosenButtonTextContent);

    // the function determines the index of an object in the local storage 
    // by using the selected button and the text content of its associated city name.
    let cityIndex = searchHistory.findIndex(element => 
        element.cityName === chosenButtonTextContent);
    let cityLat = searchHistory[cityIndex].lat;
    let cityLon = searchHistory[cityIndex].lon;

    getCurrentWeather(cityLat, cityLon);
})

displayHistorySearch()


// checge push localstorage
// call display history search when new search is implemented