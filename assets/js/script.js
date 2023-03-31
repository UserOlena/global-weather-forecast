const openWeatherMapApi = '8dae45263da0f536558e77ad17ba21c3';
const date = dayjs().format('ddd, MMM D, YYYY H:mm A');
// const historyBoxEl = $('<div>').attr('id', 'history-btn-container');
// const clearBtn = $('<button>').attr('id', 'clear-btn').text('Clear History');
let searchInputEl = $('#search-input'); 

//  the event listener for the "search" button triggers the function to obtain the latitude and longitude values for the selected city
const searchBtnClick = (event) => {
    
    searchInputEl = $('#search-input').val(); // retrieve the input value that has been entered into the search field
    
    if (!searchInputEl) {
        event.preventDefault();
        modalMessage('empty input value')
    } else {
        event.preventDefault();
        // API to get the lat and lon values based on the entered city
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInputEl}&limit=5&appid=${openWeatherMapApi}`) 
        .then(response => response.json())
        .then(data => {
            if (data.length < 1) {
                modalMessage('wrong city name');
            } else if (data.length > 1) {
                multipleCityData(data);
            } else {
                const lat = data[0].lat;
                const lon = data[0].lon;

                getCurrentWeather(lat, lon);
            }         
        })
    }
};


//  a function that can handle the processing of data in cases where the API returns information for more than one city based on a user-entered city name.
const multipleCityData = (multCityData) => {
    console.log(multCityData)
    const multCityList = $('<ul>').attr('id', 'mult-city-list');

    multCityData.forEach( element => 
        $('<li>', {
            class: 'mult-city-item',
        }).data('coordinates', { lat: element.lat, lon: element.lon 
        }).text(`${element.name}, ${element.state}, ${element.country}`
        ).appendTo(multCityList),
    )

    multCityList.click(multCityListClick);
    
    modalMessage('multiple cities', multCityList);
};


const multCityListClick = (event) => {

    if ( $(event.target).attr('class') === 'mult-city-item' ) {
        const chosenElCoordinates = {
            lat: $(event.target).data('coordinates').lat,
            lon: $(event.target).data('coordinates').lon,
        }

        console.log('button clicked')
        $('#modal-box')[0].remove();
        getCurrentWeather(chosenElCoordinates.lat, chosenElCoordinates.lon)
    } else {
        console.log('element parent was clicked')
        return
    }
}



// A function for obtaining the current weather information
const getCurrentWeather = (lat, lon) => {
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        const cityName = data.name;
        const country = data.sys.country;
       
        displayCurrentWeather(data, cityName, country)
        getForecast(lat, lon)
        saveSearchHistory(cityName, country, lat, lon);       
    });    
}


// function to retrieve the 5 day forecast weather data
const getForecast = (lat, lon) => {

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        displayForecast(data.list);
        console.log(data)
    })   
}


// displays current weather based on the weather data retrieved from the API within the getCurrentWeather()
const displayCurrentWeather = (data, cityName, country) => {

    $("#left-side").text('');
    $("#current-weather-values").text('');
    $('#weather-container').removeClass('hide');

    let iconCode = data.weather[0].icon;
    console.log(iconCode);

    const objIndex = weatherIcons.findIndex(element => element.iconCode === iconCode);

    console.log(objIndex)

    $("#left-side").append(`<ul id="left-side-list"></ul>`)
    $("#left-side-list").append(`<li id="city-name">${cityName}, ${country}</li>`); // city name, country code
    $('#left-side-list').append(`<li id="weather-condition">${data.weather[0].description}</li>`); // weather condition (cloudy/rainy etc)
    $('<img>', {
        id: 'current-weather-icon',
        src: `./assets/img/weather-icons/${weatherIcons[objIndex].iconImg}`, // weather icon ./assets/img/weather-icons/${weatherIcons[objIndex].iconImg}`
        alt: 'weather image'
    }).appendTo('#left-side');
    
    $("#current-weather-values").append(`<li id="date">${date}</li>`); // current date
    $('#current-weather-values').append(`<li>Temp: <span class="weather-value">${data.main.temp} &#8457;</span></li>`); // current temperature
    $('#current-weather-values').append(`<li>Wind: <span class="weather-value">${data.wind.speed} mph</span></span></li>`); // current wind speed 
    $('#current-weather-values').append(`<li>Humidity: <span class="weather-value">${data.main.humidity}%</span></li>`); // current humidity                         
};


// dispaly forecast weather
const displayForecast = (forecastData) => {

    $('#forecast-container').text(''); // to remove previously generated content

    const afternoonData = [];

    // for loop is used to extract objects for the upcoming five forecast days with a time of 3:00 PM. At the time when this app was developed, the openweathermap API provided icons with a night theme for forecasted weather occurring at or before 12:00 PM.
    forecastData.forEach(element => {
        
        if (dayjs(element.dt_txt).format('HH:mm:ss') === '15:00:00') {
            afternoonData.push(element);   
        }
    });
    
    // generates components based on forecast information obtained from an API
    afternoonData.forEach(element => {
        
        const dayOfWeek = dayjs(element.dt_txt).format('ddd, MMM D');
        const id = dayjs(element.dt_txt).format('MMM-D');
        const weatherIconCode = element.weather[0].icon 
        const objIndex = weatherIcons.findIndex(element => element.iconCode === weatherIconCode);
        
        $('<ul>', {
            class: 'forecast-list',
            id: `${id}`,
        }).appendTo('#forecast-container');

        $(`#${id}`).append(`<li class="week-day">${dayOfWeek}</li>`);
        $(`#${id}`).append(`<li id="weather-condition">${element.weather[0].description}</li>`); // weather condition (cloudy/rainy etc)
        $(`#${id}`).append(`<li class="forecast-icon-cont"><img 
            class="forecast-weather-icon" 
            src="./assets/img/weather-icons/${weatherIcons[objIndex].iconImg}" 
            alt="weather image"></li>`);
        $(`#${id}`).append(`<li class="forecast-item">Temp: <span class="weather-value">${element.main.temp} &#8457;</span></li>`);
        $(`#${id}`).append(`<li class="forecast-item">Wind: <span class="weather-value">${element.wind.speed} mph</span></span></li>`);
        $(`#${id}`).append(`<li class="forecast-item">Humidity: <span class="weather-value">${element.main.humidity}%</span></li>`);
    })
};


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

    // an if-statement that verifies whether the current search city already exists in the localStorage and removes it from the storage
    if (searchHistory.length > 0) {
        for (let i = 0; i < searchHistory.length; i++) {
            if (searchHistory[i].lat == newSearchItem.lat) {
                searchHistory.splice(i, 1);
            }
        }
    };

    // The new city is added to the beginning of the array using the unshift() method below, becoming the most recent item.
    searchHistory.unshift(newSearchItem);

    // To limit the array of objects to a maximum of 10 items, an if-statement has been added to remove the last items until there are only 10 remaining. 
    while (searchHistory.length > 10) {
        searchHistory.pop();
    }   

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    removeHistoryButtons();
    displayHistoryButtons();
};


// The function clears all previously generated history buttons upon initiating a new city search in order to avoid the duplication of buttons.
function removeHistoryButtons() {
    $('#clear-btn').addClass('hide');
    $('.history-btn').remove(); 
};


// function retrieves the search history from local storage and displays the stored data below the input field.
const displayHistoryButtons = () => {
    
    $('#search-input').val(''); // erases the input field's contents.
    
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    searchHistory.forEach(element => {
        
        historyBtn = $('<button>').attr('class', 'history-btn');
        historyBtn.text(`${element.cityName}, ${element.country}`);
        historyBtn.insertBefore($('#clear-btn')) ;
    });

    if (searchHistory.length) {
        $('#clear-btn').removeClass('hide');
    }
};


// The event listener for the history button triggers the function, which retrieves the text content of the selected city name and captures its latitude and longitude values. These values are then passed on to the getCurrentWeather() function to obtain the weather data.
const historyButtonClick = (event) => {

    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    let chosenButtonTextContent = event.target.textContent;

    if (event.target.getAttribute('class') !== 'history-btn') {
        return
    } else {
        console.log(chosenButtonTextContent);
        
        // the function determines the index of an object in the local storage 
        // by using the selected button's text content of its associated city name.
        let cityIndex = searchHistory.findIndex(element => `${element.cityName}, ${element.country}` === chosenButtonTextContent);
        
        let cityLat = searchHistory[cityIndex].lat;
        let cityLon = searchHistory[cityIndex].lon;
        
        getCurrentWeather(cityLat, cityLon);
    }
};


// Display modal alert message
function modalMessage(modalReason, paragraph) {
    
    const modalContainer = $('<dialog>').attr('id', 'modal-box').appendTo($('body'));
    
    const emoji = $('<img>', {
        id: 'modal-emoji',
        src: './assets/img/emoji-idk.png',
        alt: 'I don\'t know emoji',
    });
    
    const modalTitle = $('<h3>');

    if (modalReason === 'wrong city name') {
        modalTitle.text('Sorry, we could not locate the requested city. Please ensure that you have entered the correct city name.'); 
    } else if (modalReason === 'empty input value') {
        modalTitle.text('The input field must not be left empty. Please enter a city name.');
    } else if (modalReason === 'multiple cities') {
        modalTitle.text('We have found multiple options based on your search criteria. Kindly specify the city you are looking for:');
    }

    const modalCloseBtn = $('<button>').attr('id', 'modal-close-btn').text('dismiss');
    
    modalContainer.append(emoji, modalTitle, paragraph, modalCloseBtn);

    modalContainer[0].showModal();

    // Hides modal alert on click "dismiss" button
    modalCloseBtn.click( function() {
        modalContainer[0].remove()
    })
}


// this function is triggered when the "clear" history button is clicked. It removes all history buttons from the history container and deletes the data related to the history from the local storage.
function clearHistory() {

    removeHistoryButtons();
    localStorage.clear();
};

displayHistoryButtons()

// event listener for the "search" button
$('#search-btn').click(searchBtnClick);
// event listener for the "clear history" button
$('#clear-btn').click(clearHistory);
// event listener for the "history button"
$('#history-btn-container').click(historyButtonClick);
`searchButtonClick`