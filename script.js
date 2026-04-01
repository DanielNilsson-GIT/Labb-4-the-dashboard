window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("result");
    if (saved) {
        textinput.textContent = saved; //Kollar ifall "saved" innehåller något. i så fall uppdateras titeln med det som sparades.
    }

    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) {
        notesInputField.value = savedNotes;
    }

    const savedLinks = localStorage.getItem("userLinks");
    if (savedLinks) {
        linkarray = JSON.parse(savedLinks); //uppdaterar linkarray med konverterad array från JSON-format
    }
    displayLinks();
});

const astroidDate = new Date();

//Övre modul
function displayTime() {
    let currentDate = new Date();
    const clockplacement = document.getElementById("clocktime");
    const dateplacement = document.getElementById("date");

    clockplacement.classList.add("clocktime");
    dateplacement.classList.add("date");

    const day = currentDate.getDate();
    const monthName = currentDate.toLocaleString("sv-SE", { month: "long" });
    const year = currentDate.getFullYear();

    clockplacement.innerText = currentDate.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
    });
    dateplacement.innerText = `     
    ${" "} ${day} ${monthName}- ${year}
    `;
}

let textinput = document.getElementById("customTitle");

function setTitle(title) {
    localStorage.setItem("result", title);
    textinput.value = title;
}

textinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        textinput.blur();
        let customTitle = textinput.textContent;
        setTitle(customTitle);
    }
});

//nedre moduler

const modulplacement = document.getElementById("modulecontainer");

//länkmodul

let linkarray = [];
const titleinputfield = document.getElementById("titleinput");
const inputfield = document.getElementById("linkinput");
const addlinkbutton = document.getElementById("addlink");

function saveLinks(updatedArray) {
    localStorage.setItem("userLinks", JSON.stringify(updatedArray));
}

addlinkbutton.addEventListener("click", () => {
    titleinputfield.classList.toggle("visible");
    inputfield.classList.toggle("visible");
    addlinkbutton.classList.toggle("hidden");
});

inputfield.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        inputfield.classList.toggle("visible");
        titleinputfield.classList.toggle("visible");
        addNewLink();
        addlinkbutton.classList.toggle("hidden");

        displayLinks();
    }
});

function addNewLink() {
    const newlinkinput = inputfield.value.trim();
    const newtitleinput = titleinputfield.value.trim();
    if (!newlinkinput || !newtitleinput) return;
    linkarray.push({
        url: newlinkinput,
        title: newtitleinput,
    });

    saveLinks(linkarray);
    inputfield.value = "";
    titleinputfield.value = "";
}

function displayLinks() {
    const listitemplacement = document.getElementById("firstmoduleitems");
    listitemplacement.innerHTML = "";
    //nedanför vet js automatiskt att index är index för array
    linkarray.forEach((linkitem, index) => {
        const module_one = document.createElement("li"); //Skapar ett listitem
        module_one.classList.add("listitem");

        //Dela upp skapandet av länk och knapp
        //länk
        const a = document.createElement("a");
        a.href = `https://${linkitem.url}`;
        a.target = "_blank"; //öppnar länk i ny flik
        a.textContent = `${linkitem.title}`;
        //favicon
        const img = document.createElement("img");
        img.src = `${a.href}/favicon.ico`;
        img.alt = "";
        img.classList.add("favicon");

        //knapp
        const removelinkbtn = document.createElement("button");
        removelinkbtn.textContent = "❌";
        removelinkbtn.classList.add("removelinkbtn");

        removelinkbtn.addEventListener("click", () => {
            linkarray.splice(index, 1);
            saveLinks(linkarray);
            displayLinks();
        });
        module_one.appendChild(img);
        module_one.appendChild(a);
        module_one.appendChild(removelinkbtn);
        listitemplacement.appendChild(module_one); //måste dela upp "appends" iom tidigare uppdelning av objekt a och button
    });
}

//väder api:
const weatheremojis = [
    { kod: 0, text: "Soligt", emoji: "☀️" },
    { kod: 1, text: "Mestadels soligt", emoji: "🌤️" },
    { kod: 2, text: "Lätta moln", emoji: "🌤️" },
    { kod: 3, text: "Tunga moln", emoji: "🌥️" },
    { kod: 45, text: "Dis", emoji: "☁️" },
    { kod: 48, text: "Dis", emoji: "☁️" },
    { kod: 51, text: "Regn", emoji: "☔" },
    { kod: 53, text: "Regn", emoji: "☔" },
    { kod: 55, text: "Regn", emoji: "☔" },
    { kod: 56, text: "Regn", emoji: "☔" },
    { kod: 57, text: "Regn", emoji: "☔" },
    { kod: 61, text: "Regn", emoji: "☔" },
    { kod: 63, text: "Regn", emoji: "☔" },
    { kod: 65, text: "Regn", emoji: "☔" },
    { kod: 66, text: "Regn", emoji: "☔" },
    { kod: 67, text: "Regn", emoji: "☔" },
    { kod: 80, text: "Regn", emoji: "☔" },
    { kod: 81, text: "Regn", emoji: "☔" },
    { kod: 82, text: "Regn", emoji: "☔" },
    { kod: 95, text: "Åska", emoji: "⛈️" },
    { kod: 96, text: "Åska", emoji: "⛈️" },
    { kod: 97, text: "Åska", emoji: "⛈️" },
    { kod: 98, text: "Åska", emoji: "⛈️" },
    { kod: 99, text: "Åska", emoji: "⛈️" },
];

let latitude = null;
let longitude = null;

navigator.geolocation.getCurrentPosition(async (myPosition) => {
    longitude = myPosition.coords.longitude;
    latitude = myPosition.coords.latitude;

    const weather = await getWeather(longitude, latitude);
    getWeatherByTime(weather);
    displayWeather(weather);
});

async function getWeather(longitude, latitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,weather_code&current=temperature_2m,weather_code,wind_speed_10m&forecast_days=3`;

    let responze = await fetch(url);
    let result = await responze.json();
    console.log(result);
    console.log(`koden är:${result.current.weather_code}`);
    return result;
}

let weatherObjectsIndex = [];

//Hämta väderdata för klockan 12.
function getWeatherByTime(apiresult) {
    weatherObjectsIndex = [];
    apiresult.hourly.time.forEach((timeelement, index) => {
        if (timeelement.includes("T12:00")) {
            weatherObjectsIndex.push(index);
        }
        console.log(weatherObjectsIndex);
    });
}

function displayWeather(weatherresult) {
    //vart väderkort ska placeras.
    const weatherPlacement = document.getElementById("weatherplacement");

    let counter = 1; //Håller reda på vilken dag det är.
    weatherObjectsIndex.forEach((index) => {
        //För varje hämtat väder kl.12 skapas nedanstående:
        const weatherParameters = document.createElement("li");
        weatherParameters.classList.add("weatherelement");

        //datumhantering för att hitta dagens datum och köra korrekt funktion.
        const dateOnly = weatherresult.hourly.time[index].split("T")[0];
        const todaysday = new Date().toISOString().split("T")[0];

        //datumhantering för att visa kommande väder
        const today = new Date();
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + counter);

        if (dateOnly === todaysday) {
            displayWeatherNow(weatherresult);
        } //Dagens datum körs via egen funktion

        let dayInWeek = futureDate.toLocaleDateString("sv-SE", {
            weekday: "long",
        }); //För att skriva rätt dag i visning av väder

        const temp = weatherresult.hourly.temperature_2m[index];
        const weatherCode = weatherresult.hourly.weather_code[index];
        let emojiObj = "?"; //För att inte få null-problem i foreach så sätt ett startvärde.
        weatheremojis.forEach((item) => {
            if (item.kod === weatherCode) {
                emojiObj = item;
            } //matcha mina väderkoder mot api-koden

            //Själva skapandet av "väderkort"
            weatherParameters.innerHTML = `
        <p class="emojimodule">
   ${emojiObj.emoji}
</p>

<div class="weatherinfo">
     <h5 class="weathertitle">Väder för ${dayInWeek}:</h5>

     <div class="weatherrow">
         <p class="temp">${temp}°C</p>
         <p class="wind">${emojiObj.text}</p>
     </div>
 </div>
 `;
            weatherPlacement.append(weatherParameters);
        });
        counter++;
    });
}

function displayWeatherNow(weatherresult) {
    const currenttemp = weatherresult.current.temperature_2m;
    const weatherPlacement = document.getElementById("weatherplacement");
    const weatherParameters = document.createElement("li");
    weatherParameters.classList.add("weatherelement");
    weatherParameters.innerHTML = `
<p class="emojimodule">
    ${weatheremojis[weatherresult.current.weather_code].emoji}
</p>
<div class="weatherinfo">
    <h5 class="weathertitle">Nuvarande väder:</h5>
    <div class="weatherrow">
        <p class="temp">${currenttemp}°C</p>
        <p class="wind">${weatheremojis[weatherresult.current.weather_code].text}</p>
    </div>
</div>
`;
    weatherPlacement.append(weatherParameters);
}

//tredje modulen:
async function fetchAstroidData() {
    let todaysdate = astroidDate.toISOString().split("T")[0]; //delar upp strängen i två delar och skapar en array med dessa delar
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todaysdate}&end_date=${todaysdate}&api_key=DEMO_KEY`;
    let response;
    try {
        response = await fetch(url);
    } catch (error) {
        console.log("Kunde inte hämta data", error);
    }
    if (response?.ok) {
        const result = await response.json();
        console.log(result);
        return result.near_earth_objects[`${todaysdate}`];
    } else {
        return [];
    }
}

function displayMeteorData(ztroidresult) {
    const placement = document.getElementById("thirdmodule");
    // placement.innerHTML = ``;
    let closestMeteor = null;
    let startdistance = Infinity;
    if (!ztroidresult || ztroidresult.length === 0) {
        placement.innerHTML = "<h2>Inga meteorer för idag.</h2>";
        return;
    } else {
        ztroidresult.forEach((ztroid) => {
            if (
                Number(
                    ztroid.close_approach_data[0].miss_distance.kilometers,
                ) <= startdistance
            ) {
                startdistance = Number(
                    ztroid.close_approach_data[0].miss_distance.kilometers,
                );
                closestMeteor = ztroid;
            }
        });

        let ztroiddiv = document.createElement("div");
        ztroiddiv.classList.add("ztroiddiv");

        if (closestMeteor.is_potentially_hazardous_asteroid == true) {
            ztroiddiv.innerHTML = `<h2>Farlig meteor på ingång sök skydd!</h2>
            <p>Namn:${closestMeteor.name} <br></br> Avstånd till jorden:${Math.round(startdistance)}km<br></br>Meteorens storlek:${Math.round(closestMeteor.estimated_diameter.meters.estimated_diameter_min)}Meter i diameter</p>`;
        } else {
            ztroiddiv.innerHTML = `<h2>Inga farliga meteorer idag. Du kan lämna hjälmen hemma.</h2>
            <p>Denna är närmst idag: <br></br>Namn:${closestMeteor.name} <br></br> Avstånd till jorden:${Math.round(startdistance)}km<br></br>Meteorens storlek:${Math.round(closestMeteor.estimated_diameter.meters.estimated_diameter_min)}Meter i diameter</p></p>
            `;
        }
        placement.appendChild(ztroiddiv);
    }
}

//fjärde modulen
const notesInputField = document.getElementById("notes-section");
let userNotes = notesInputField.value;
function saveInput(userNotes) {
    localStorage.setItem("userNotes", userNotes);
    notesInputField.value = userNotes;
}

const savedNotes = localStorage.getItem("userNotes");
notesInputField.addEventListener("input", () => {
    {
        let userNotes = notesInputField.value;
        saveInput(userNotes);
    }
});

//Randompicgenerator
const apiKey = "3VhECh_LVlKEKcij7zf2wQbr1Tt_Ll8AiUwWseSK6MY";

const picgeneratorplacement = document.getElementById("randompicgenerator");
async function fetchPic() {
    const picURL = `https://api.unsplash.com/photos/random?client_id=${apiKey}&query=background`;
    const response = await fetch(picURL);
    const result = await response.json();
    console.log(result);
    return result;
}

const picbutton = document.getElementById("randompicgenerator");

picbutton.addEventListener("click", async () => {
    let resultpic = await fetchPic();
    document.body.style.backgroundImage = `url(${resultpic.urls.regular})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
});

//runtime
// fetchAstroidData().then((data) => {
//     displayMeteorData(data);
// });

setInterval(displayTime, 1000);
