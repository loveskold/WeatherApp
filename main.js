let query = "Umeå"; //Startvärde
let type = "metric";
const radioCelsius = document.getElementById("celsius");
const radioFahrenheit = document.getElementById("fahrenheit");

const currentDate = new Date();

function clickPress(event) {
    if (event.keyCode == 13) {
        getWeather();
    }
}

const api = {
    key: "50014560ed085145bb2939778d82a3cc",
    base: "https://api.openweathermap.org/data/2.5/"
}

function getWeather() {
    if (document.getElementById("search").value != ""){
        query = document.getElementById("search").value; //Tar värdet från input-box
    }
    document.getElementById("search").value = "";
    if (radioCelsius.checked){
        type = "metric";
    }
    else if (radioFahrenheit.checked){
        type = "imperial";
    }

    fetch(`${api.base}weather?q=${query}&units=${type}&lang=sv&appid=${api.key}`) //Tar väderdata från OpenWeather
    .then(data => {
        return data.json(); //Konverterar väderdatan till json
    }).then (displayResults);
    
    fetch(`${api.base}forecast?q=${query}&units=${type}&lang=sv&appid=${api.key}`) //Tar väderdata från OpenWeather
    .then(dataForecast => {
        return dataForecast.json(); //Konverterar väderdatan till json
    }).then (displayForecast);
}

function displayForecast(dataForecast) {
    console.log(dataForecast);
    
    let div2 = document.getElementById("hour-container");
    div2.innerHTML = '';

    for (let i = 1; i < 9; i++) {
        let div = document.createElement("div");
        div.className = "hour";

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
        time.innerHTML = dataForecast.list[i].dt_txt;
        time.className = "time";

        let icon = document.createElement("i");
            icon.className = ("fa-2xl fa-solid forecast-icon");

            switch(dataForecast.list[i].weather[0].main) {
                case "Clear":
                    icon.classList.add("fa-sun")
                    break;
                case "Snow":
                    icon.classList.add("fa-snowflake")
                    break;
                case "Mist":
                    icon.classList.add("fa-smog")
                    break;
                case "Rain":
                    icon.classList.add("fa-cloud-rain")
                    break;
                case "Smog":
                    icon.classList.add("fa-smog")
                    break;
                case "Haze": 
                    icon.classList.add("fa-user")
                    break;
                case "Clouds": 
                    icon.classList.add("fa-cloud")
                    break;
            }
            div.appendChild(temp);
            div.appendChild(time);
            div.appendChild(desc);
            div.appendChild(icon);
            div2 = document.getElementById("hour-container"); 
            div2.appendChild(div);
        }
    

    div2 = document.getElementById("5day-forecast-day-container"); 
    div2.innerHTML = ''; //Clearar forecast container

    const weekday = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];

    for (let i = 0; i < 40; i++){
        if (i == 8 || i == 16 || i == 24 || i == 32 || i == 39){
            let div = document.createElement("div");
            div.className = "day";

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
            console.log(day);

            let weekdayDisplay = document.createElement("span");
            weekdayDisplay.innerHTML = day;
            weekdayDisplay.className = "weekday";

            let desc = document.createElement("span");
            desc.innerHTML = `${dataForecast.list[i].weather[0].description}`;
            desc.className = "desc";

            let icon = document.createElement("i");
            icon.className = ("fa-2xl fa-solid forecast-icon");

            switch(dataForecast.list[i].weather[0].main) {
                case "Clear":
                    icon.classList.add("fa-sun")
                    break;
                case "Snow":
                    icon.classList.add("fa-snowflake")
                    break;
                case "Mist":
                    icon.classList.add("fa-smog")
                    break;
                case "Rain":
                    icon.classList.add("fa-cloud-rain")
                    break;
                case "Smog":
                    icon.classList.add("fa-smog")
                    break;
                case "Haze": 
                    icon.classList.add("fa-user")
                    break;
                case "Clouds": 
                    icon.classList.add("fa-cloud")
                    break;
            }

            div.appendChild(weekdayDisplay);
            div.appendChild(temp);
            div.appendChild(desc);
            div.appendChild(icon);
            let div2 = document.getElementById("5day-forecast-day-container"); 
            div2.appendChild(div);
        }
    }

}

function displayResults(data) {
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
    iconDisplay.className = "fa-2xl fa-solid";
    
    switch(data.weather[0].main) {
        case "Clear":
            iconDisplay.classList.add("fa-sun")
            break;
        case "Snow":
            iconDisplay.classList.add("fa-snowflake")
            break;
        case "Mist":
            iconDisplay.classList.add("fa-smog")
            break;
        case "Rain":
            iconDisplay.classList.add("fa-cloud-rain")
            break;
        case "Smog":
            iconDisplay.classList.add("fa-smog")
            break;
        case "Haze": 
            iconDisplay.classList.add("fa-user")
            break;
        case "Clouds": 
            iconDisplay.classList.add("fa-cloud")
            break;
    }
    let date = document.getElementById("date");
    date.innerHTML = `${currentDate.getDate()} / ${currentDate.getMonth() + 1} / ${currentDate.getFullYear()}`;
}


function GetCountry(country) {
    fetch(`https://restcountries.com/v3.1/alpha/${country}`) 
    .then(dataCountry => {
        return dataCountry.json(); //Konverterar landsdatan till json
    }).then (displayCountry);
}

function displayCountry(dataCountry){
    document.getElementById("flag").src = dataCountry[0].flags.png;
}