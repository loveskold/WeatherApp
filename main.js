let query = "Umeå"; // Startvärde
let type = "metric"; // Börjar med Celsius

const radioCelsius = document.getElementById("celsius");
const radioFahrenheit = document.getElementById("fahrenheit");

const hourContainer = document.getElementById("hour-container");
const dayContainer = document.getElementById("day-container");

const currentDate = new Date();


function clickPress(event) {
    if (event.keyCode == 13) { // Om man klickar Enter ska söka
        getWeather();
    }
}


const api = {
    key: "50014560ed085145bb2939778d82a3cc", // API nyckel
    base: "https://api.openweathermap.org/data/2.5/" // Början på url
}

function getWeather() {
    if (document.getElementById("search").value != ""){
        query = document.getElementById("search").value; // Tar värdet från input-box
    }
    document.getElementById("search").value = ""; // Tömmer inputboxen
    if (radioCelsius.checked){
        type = "metric";
    }
    else if (radioFahrenheit.checked){
        type = "imperial";
    }

    fetch(`${api.base}weather?q=${query}&units=${type}&lang=sv&appid=${api.key}`) // Tar väderdata från OpenWeather
    .then(data => {
        return data.json(); // Konverterar väderdatan till json
    }).then (displayResults)
    .catch(function(error) {
        console.log('An error occurred:', error);
    });
    
    
    fetch(`${api.base}forecast?q=${query}&units=${type}&lang=sv&appid=${api.key}`) 
    .then(dataForecast => {
        return dataForecast.json(); 
    }).then (displayForecast)
    .catch(function(error) {
        console.log('An error occurred:', error);
    });
}

function displayForecast(dataForecast) { // Funktion som visar 24 timmar prognosen och 5 dagar prognosen på sidan
    hourContainer.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
        let hourObject = document.createElement("div");
        hourObject.className = "hour";

        let temp = document.createElement("span");
        if (type == "metric"){
            temp.innerHTML = Math.round(dataForecast.list[i].main.temp) + " °C";
        }
        else if (type == "imperial"){
            temp.innerHTML = Math.round(dataForecast.list[i].main.temp) + " °F";
        }
        temp.className = "temp";

        let desc = document.createElement("p");
        desc.innerHTML = dataForecast.list[i].weather[0].description;
        desc.className = "desc";

        let time = document.createElement("span");
        time.innerHTML = dataForecast.list[i].dt_txt.substring(10, 13);
        time.className = "time";

        let icon = document.createElement("i");
        icon.className = ("fa-2xl fa-solid forecast-icon");

        let iconType = GetIcon(dataForecast.list[i].weather[0].main);
        icon.classList.add(iconType);

        // Lägger till all text till hour
        hourObject.appendChild(temp);
        hourObject.appendChild(time);
        hourObject.appendChild(desc);
        hourObject.appendChild(icon);
        hourContainer.appendChild(hourObject);
    }
    
    let dayContainer = document.getElementById("day-container"); 
    dayContainer.innerHTML = ''; // Clearar forecast container
    const weekday = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];
    for (let i = 0; i < 40; i++){
        if (i == 8 || i == 16 || i == 24 || i == 32 || i == 40) { // Varje 24 timmar (i = 3 timmar)
            let maxTempNumber = Number.MIN_SAFE_INTEGER;
            let minTempNumber = Number.MAX_SAFE_INTEGER;

            let maxTemp = document.createElement("span");
            let minTemp = document.createElement("span");
            maxTemp.className = "small-text";
            minTemp.className = "small-text";

            for (let j = i; j < i + 8; j++) // Från början på dagen till slutet (24 timmar)
            {
                if (dataForecast.list[j].main.temp > maxTempNumber)
                {
                    maxTempNumber = dataForecast.list[j].main.temp;
                }
                if (dataForecast.list[j].main.temp < minTempNumber)
                {
                    minTempNumber = dataForecast.list[j].main.temp;
                }
            }
            
            if (type == "metric"){
                minTemp.innerHTML = "L: " + Math.round(minTempNumber) + " °C";
                maxTemp.innerHTML = "H: " + Math.round(maxTempNumber) + " °C";
            }
            else if (type == "imperial"){
                minTemp.innerHTML = "L: " + minTempNumber + " °F";
                maxTemp.innerHTML = "H: " + maxTempNumber + " °F";
            }

            let dayObject = document.createElement("div");
            dayObject.className = "day";
            
            let temp = document.createElement("span");
            if (type == "metric"){
                temp.innerHTML = Math.round(dataForecast.list[i].main.temp) + " °C";
            }
            else if (type == "imperial"){
                temp.innerHTML = Math.round(dataForecast.list[i].main.temp) + " °F";
            }
            temp.className = "temp";

            let d = new Date(dataForecast.list[i].dt_txt);
            let day = weekday[d.getDay()];

            let weekdayDisplay = document.createElement("span");
            weekdayDisplay.innerHTML = day;
            weekdayDisplay.className = "weekday";

            let desc = document.createElement("span");
            desc.innerHTML = `${dataForecast.list[i].weather[0].description}`;
            desc.className = "desc";

            let icon = document.createElement("i");
            icon.className = ("fa-2xl fa-solid forecast-icon"); 

            let iconType = GetIcon(dataForecast.list[i].weather[0].main);
            icon.classList.add(iconType);
            
            dayObject.appendChild(weekdayDisplay);
            dayObject.appendChild(temp);
            dayObject.appendChild(maxTemp);
            dayObject.appendChild(minTemp);
            dayObject.appendChild(desc);
            dayObject.appendChild(icon);
            
            dayContainer.appendChild(dayObject);
        }
    }
}

function displayResults(data) { // Funktion som endast visar aktuella vädret
    document.getElementById("title").innerHTML = "Väder i " + data.name + " - Meteo"; // Ändrar titeln på sidan
    let location = document.getElementById("location");
    location.innerHTML = data.name + ", " + data.sys.country;

    GetCountry(data.sys.country);

    let temp = document.getElementById("temp");
    if (type == "metric"){
        temp.innerHTML = Math.round(data.main.temp) + " °C";
    }
    else if (type == "imperial"){
        temp.innerHTML = Math.round(data.main.temp) + " °F";
    }
    
    let status = document.getElementById("status");
    status.innerHTML = "Just nu är det " + data.weather[0].description;

    let iconDisplay = document.getElementById("icon-display");
    iconDisplay.className = "fa-4x fa-solid";
    
    let iconType = GetIcon(data.weather[0].main);
    iconDisplay.classList.add(iconType);

    let date = document.getElementById("date");
    date.innerHTML = `${currentDate.getDate()} / ${currentDate.getMonth() + 1} / ${currentDate.getFullYear()}`;
}

function GetIcon(weatherCondition) { // Funktion som ger väderikonerna rätt utseende
    switch(weatherCondition) { 
        case "Clear":
            return "fa-sun";
        case "Snow":
            return "fa-snowflake";
        case "Mist":
            return "fa-smog";
        case "Rain":
            return "fa-cloud-rain";
        case "Smog":
            return "fa-smog";
        case "Haze": 
            return "fa-user";
        case "Clouds": 
            return "fa-cloud";
    }
}

function GetCountry(country) {
    fetch(`https://restcountries.com/v3.1/alpha/${country}`) 
    .then(dataCountry => {
        return dataCountry.json(); // Konverterar landsdatan till json
    }).then (displayCountry);
}

function displayCountry(dataCountry){
    document.getElementById("flag").src = dataCountry[0].flags.png; // Ändrar flaggan till aktuellt land
    console.log(dataCountry);
    document.getElementById("flag").title = dataCountry[0].name.common + " Flag";
    document.getElementById("flag").alt = dataCountry[0].name.common + " Flag";
}

function chars()
{
    var charLength = document.getElementById("msg").value;
    document.getElementById("msgChars").innerHTML = 150 - charLength.length + " tecken kvar";
}

// Mobilanpassad navbar (jQuery)

var navOpen = false;
$(document).ready(function()
    {
        $("#nav-icon").click(function ()
        {
            if (navOpen) // Om man klickar ikonen och navbar är öppen ska ikonen återgå till bars
            {
                $("#nav-icon").removeClass("fa-x");
                $("#nav-icon").addClass("fa-bars fa-flip");
                setTimeout(function ()
                {   
                    $("#nav-icon").removeClass("fa-flip"); // Slutar flip-animationen efter 400ms
                }, 400);
                navOpen = false;
            }
            else if (!navOpen) // Om man klickar ikonen och navbar inte är öppen ska ikonen bli till ett X
            {
                $("#nav-icon").removeClass("fa-bars");
                $("#nav-icon").addClass("fa-x fa-flip");
                setTimeout(function ()
                {   
                    $("#nav-icon").removeClass("fa-flip"); 
                }, 400);
                
                navOpen = true;
            }
            if ($("#nav-icon").hasClass("click"))
            {
                $("#nav-icon").removeClass("click");
                $("nav ul").slideToggle();
                setTimeout(function ()
                {   
                    $("#nav-icon").addClass("click");
                }, 500);
            }
        });
    
        $(window).resize(function()
        {
            if ($(window).width() > 767)
            {
                $("nav ul").removeAttr('style');
                $("#nav-icon").addClass("fa-bars");
                $("#nav-icon").removeClass("fa-x");
            }
        });
    });