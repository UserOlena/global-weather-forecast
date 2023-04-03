# Global Weather Forecast
>The Global Weather Forecast was developed as a component of the Berkeley Coding Bootcamp Challenge 6. Users can view current and five-day forecast weather information by entering a city name in the input field. The development of the application was done accordingly to [user story](#user-tory) and [acceptance criteria](#acceptance-criteria).

> Live demo [_here_](https://userolena.github.io/global-weather-forecast/).

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Preview](#preview)
* [Setup](#setup)
* [Usage](#usage)
* [Features](#features)
* [Credits](#credits)
* [Project Status](#project-status)
* [User Story](#user-story)
* [Acceptance Criteria](#acceptance-criteria)
* [Contact](#contact)
* [License](#license)


## General Information
- The primary objective of the Global Weather Forecast is to provide current and five-day forecast weather information.


## Technologies Used
- JavaScript
- HTML5
- CSS
- Local Storage
- JSON
- JQUERY
- [day.js API](https://day.js.org/en/)
- [openweathermap API](https://openweathermap.org/api)


## Preview
![Example screenshot](./assets/img/preview.gif)


## Setup
There is no need for installation as the web application is readily available for use [_here_](https://userolena.github.io/global-weather-forecast/)


## Usage
- In order to check the weather for a specific city, the user needs to type the city name into the input field.
- If there are multiple cities found based on the entered city name, a modal alert will appear, prompting the user to specify the city's state and country.
- Once the user has selected their desired city, the application will display the current and five-day weather information for that location.
- Underneath the search button, a history list is displayed for the user to easily access their most frequently searched cities and check their weather information with just a click.
- Located under all the buttons with previously searched cities, there is a "delete history" button that allows the user to remove all previously searched cities.


## Features
- The header of the page displays the current real-world time that updates dinamically.
- If the user enters an incorrect city name, a modal alert will notify them that the city name was incorrect.
- If the input field is left empty and the search button is clicked, a modal alert will notify the user that the field cannot be left blank.
- If there are multiple cities found based on the entered city name, a modal alert will appear, prompting the user to specify the city's state and country.
- After the user selects their desired city, the application will display the current and five-day weather information for that location, including the city name, temperature, humidity, wind speed, weather condition, and an icon representing the weather condition.
- Each city search will be saved to the local storage and displayed underneath the search button in the form of buttons, allowing the user to easily access their most frequently searched cities and check their weather information with just a click.
- Whether the user searches for a new city or clicks on a previously searched city button, the most recent city search will always appear at the top of the history button list.
- The list of previously searched cities is limited to 10 objects to be stored in the local storage. If the user conducts an 11th search, the oldest city search will be automatically removed from both the local storage and the screen.
- Before saving each city search to the local storage, a validation check is completed to ensure that the city doesn't already exist in the local storage. If the city already exists, it will be moved to the top of the buttons without being duplicated.
- Located under all the buttons with previously searched cities, there is a "delete history" button that allows the user to remove all information related to their searched cities from both their local storage and their screen.


## Credits
Weather animated icons were downloaded from [amcharts.com](https://www.amcharts.com/free-animated-svg-weather-icons/). Icons are licensed under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode)


## Project Status
Project is: _complete_ 


## User Story

```md
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```


## Acceptance Criteria

```md
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```


## Contact
Created by [Olena P](https://github.com/UserOlena) 


## License
This project is open source and available under the [MIT License](./LICENSE).
