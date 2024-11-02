const apiKey = '878d19eb93744f170013b43d6633dce4';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=';
const apiURL4days = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=ru&q=';
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const dayOne = document.getElementById('one');
const daysFour = document.getElementById('four');
const nextDays = document.querySelector('.next-days')

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

async function checkWeather4Days(searchCity) {

    const response = await fetch(apiURL4days + `${searchCity}&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector('.error span').textContent = 'Такого города не существует'
        return;
    } else {
        document.querySelector('.error span').textContent = '';
    }
    const data = await response.json();
    nextDays.innerHTML = ''
    for (let i = 12; i < data.list.length; i += 8) {
        renderNextDay(data.list[i]);
    }
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value.trim());
    if (daysFour.classList.contains('active')) {
        checkWeather4Days(searchBox.value.trim());
    }
});

searchBox.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        checkWeather(searchBox.value.trim());
        if (daysFour.classList.contains('active')) {
            checkWeather4Days(searchBox.value.trim());
        }
    }
});

dayOne.addEventListener('click', () => {
    dayOne.classList.add('active');
    daysFour.classList.remove('active');
    nextDays.classList.remove('show');
});

daysFour.addEventListener('click', () => {
    daysFour.classList.add('active');
    dayOne.classList.remove('active');
    nextDays.classList.add('show');
    nextDays.innerHTML = '';
    checkWeather4Days(searchBox.value.trim());

});

function renderNextDay(day) {
    let nextDay = document.createElement('div');
    nextDay.classList.add('day-next');
    nextDay.innerHTML = `
        <p class="day-title">${fixDate(day.dt_txt)}</p>
        <div class="day-weather">
            <img src="./images/${day.weather[0].main.toLowerCase()}.png" class="weather-icon-day">
            <h2 class="temp">${Math.round(day.main.temp)} &deg;C</h2>
        </div>
        <div class="details">
            <div class="col"><img src="./images/humidity.png">
                <div>
                    <p class="humidity">${Math.round(day.main.humidity)}%</p>
                    <p>Влажность</p>
                </div>
            </div>
            <div class="col">
                <img src="./images/wind.png">
                <div>
                    <p class="wind">${day.wind.speed}м/с</p>
                    <p>Скорость ветра</p>
                </div>
            </div>
        </div>
    `;
    nextDays.appendChild(nextDay);
}

function fixDate(dateDay) {
    const date = new Date(dateDay);
    console.log(date);
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
    return `${date.getDate()} ${months[date.getMonth()]}`;
}