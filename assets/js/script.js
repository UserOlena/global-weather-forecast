const openWeatherMapApi = '8dae45263da0f536558e77ad17ba21c3';


// display the current day in the header.
const displayTime = () => {
    const date = dayjs().format('ddd, MMM D, YYYY H:mm A');
    $('#date').text(`${date}`); // current date
    updateTime();
}


// function triggers displayTime() every second to display real-time changes
const updateTime = () => {
    setTimeout(displayTime, 1000);
}

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
                console.log(data)
                createMultipleCityList(data);
            } else {
                const newCityObj = createNewCityObj(data[0]);
                getCurrentWeather(newCityObj);
            }         
        })
    }
};


// function generates a new object by retrieving data from an API based on the user's search for a particular city.
const createNewCityObj = (cityData) => {
    return {
        cityName: cityData.name,
        state: cityData.state,
        country: cityData.country,
        lat: cityData.lat,
        lon: cityData.lon,
    }
}


// a function that can handle the processing of data in cases where the API returns information for more than one city based on a user-entered city name.
const createMultipleCityList = (multCityData) => {
    console.log(multCityData)
    const multCityList = $('<ul>').attr('id', 'mult-city-list');

    multCityData.forEach( element => 
        $('<li>', {
            class: 'mult-city-item',
        }).data('cityData', createNewCityObj(element)
        ).text(`${element.name}, ${element.state}, ${element.country}`
        ).appendTo(multCityList),
    )

    multCityList.click(multCityListClick);
    
    modalMessage('multiple cities', multCityList);
};


// function is triggered when the user selects a specific city from the list of multiple city options. It then retrieves the corresponding data for that city and passes it on to the getCurrentWeather() function to obtain weather informationa and save the newly selected city in the local storage
const multCityListClick = (event) => {

    if ( $(event.target).hasClass('mult-city-item') ) {
        const chosenCityData = $(event.target).data('cityData');

        console.log(chosenCityData, 'button clicked')
        $('#modal-box')[0].remove();
        getCurrentWeather(chosenCityData)
    } else {
        console.log('element parent was clicked')
        return
    }
}



// A function for obtaining the current weather information
const getCurrentWeather = (newCityObj) => {
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${newCityObj.lat}&lon=${newCityObj.lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
            
        displayCurrentWeather(data, newCityObj)
        getForecast(newCityObj.lat, newCityObj.lon)
        saveSearchHistory(newCityObj);       
    });    
}


// function to retrieve the 5 day forecast weather data
const getForecast = (lat, lon) => {

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApi}`)
    .then(response => response.json())
    .then(data => {
        displayForecast(data.list);
    })   
}


// displays current weather based on the weather data retrieved from the API within the getCurrentWeather()
const displayCurrentWeather = (weatherData, newCityObj) => {

    $('.remove-content').text('');
    $('.remove-src-attr').removeAttr('src');
    $('#weather-container').removeClass('hide');
    
    $('#city-name').text(`${newCityObj.cityName}, ${newCityObj.state}, ${newCityObj.country}`);
    $('#weather-condition').text(`${weatherData.weather[0].description}`);
    $('#temp-value').text(`${weatherData.main.temp} \u2109`);
    $('#wind-value').text(`${weatherData.wind.speed} mph`);
    $('#humidity-value').text(`${weatherData.main.humidity}%`);
    
    const objIndex = weatherIcons.findIndex(element => element.iconCode === weatherData.weather[0].icon);
    $('#current-weather-icon').attr('src', `./assets/img/weather-icons/${weatherIcons[objIndex].iconImg}`) // weather icon
};


// dispaly forecast weather
const displayForecast = (forecastData) => {
    console.log(forecastData)
    $('#forecast-container').text(''); // to remove previously generated content

    const afternoonData = [];

    // for loop is used to extract objects for the upcoming five forecast days with a day themed icon
    forecastData.forEach(element => {       
        if ((dayjs(element.dt_txt).format('HH:mm:ss') === '09:00:00' && element.sys.pod === 'd') || (dayjs(element.dt_txt).format('HH:mm:ss') === '21:00:00' && element.sys.pod === 'd')) {
            afternoonData.push(element);   
        }
    });
    
    // generates components based on forecast information obtained from an API
    afternoonData.forEach(element => {       
        const dayOfWeek = dayjs(element.dt_txt).format('ddd, MMM D');
        const id = dayjs(element.dt_txt).format('MMM-D');
        const weatherIconCode = element.weather[0].icon;
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
const saveSearchHistory = (newCityObj) => {

    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    console.log(newCityObj)
    // an if-statement that verifies whether the current search city already exists in the localStorage and removes it from the storage
    if (searchHistory.length > 0) {
        for (let i = 0; i < searchHistory.length; i++) {
            if (searchHistory[i].lat == newCityObj.lat) {
                searchHistory.splice(i, 1);
            }
        }
    };

    // The new city is added to the beginning of the array using the unshift() method below, becoming the most recent item.
    searchHistory.unshift(newCityObj);

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
        
        historyBtn = $('<button>').attr('class', 'history-btn'
        ).data('cityLat', {
            lat: element.lat,
        }).text(`${element.cityName}, ${element.country}`
        ).insertBefore($('#clear-btn')) ;
    });

    if (searchHistory.length) {
        $('#clear-btn').removeClass('hide');
    }
};


// The event listener for the history button triggers the function, which retrieves the text content of the selected city name and captures its latitude and longitude values. These values are then passed on to the getCurrentWeather() function to obtain the weather data.
const historyButtonClick = (event) => {

    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    const chosenCityLat = $(event.target).data('cityLat').lat;

    if ($(event.target).hasClass('history-btn')) {
        console.log(chosenCityLat);
        
        // using the arbitrary data (latitude) of the selected DOM button, the function identifies the index of an object in the local storage
        const chosenCityIndex = searchHistory.findIndex(element => element.lat === chosenCityLat);
        
        getCurrentWeather(searchHistory[chosenCityIndex]);
    } else {
        return
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
}


displayHistoryButtons();
displayTime();

// event listener for the "search" button
$('#search-btn').click(searchBtnClick);
// event listener for the "clear history" button
$('#clear-btn').click(clearHistory);
// event listener for the "history button"
$('#history-btn-container').click(historyButtonClick);
