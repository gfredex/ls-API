const apiKey = '878d19eb93744f170013b43d6633dce4';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=';
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const dayOne = document.getElementById('one');
const daysFour = document.getElementById('four');

if (localStorage.getItem('saveCity')) {
    searchBox.value = localStorage.getItem('saveCity');
    checkWeather(localStorage.getItem('saveCity'));
}

async function checkWeather(searchCity) {
    localStorage.setItem('saveCity', searchCity);
    const response = await fetch(apiURL + `${searchCity}&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector('.error span').textContent = 'Такого города не существует'
        return;
    } else {
        document.querySelector('.error span').textContent = '';
    }
    const data = await response.json();
    city.textContent = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + ' &deg;C';
    document.querySelector('.humidity').textContent = data.main.humidity + '%';
    document.querySelector('.wind').textContent = Math.round(data.wind.speed) + ' м/с';
    weatherIcon.src = './images/' + data.weather[0].main.toLowerCase() + '.png';
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value.trim());
});

searchBox.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        checkWeather(searchBox.value.trim());
    }
});

dayOne.addEventListener('click', () => {
    dayOne.classList.add('active');
    daysFour.classList.remove('active');
});

daysFour.addEventListener('click', () => {
    daysFour.classList.add('active');
    dayOne.classList.remove('active');
});