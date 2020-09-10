import React, {useState} from 'react';
import Location from './location.js'

const weatherApi = {
    key: "5f19c03a4c8370148cb0abfc7bf6ce8d",
    base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});

    const search = event => {
        if (event.key === "Enter") {
            fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}&lang=cz`)
                .then(response => response.json())
                .then(weatherResult => {
                    setWeather(weatherResult)
                    setQuery('')
                })
        }
    }

    const dateBuilder = (d) => {
        let months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červecen", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]
        let days = ["Sobota", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Neděle"]

        let day = days[d.getDay()]
        let date = d.getDate()
        let month = months[d.getMonth()]
        let year = d.getFullYear()

        return `${day} ${date}. ${month} ${year}`
    }
    return (
        <div className={(typeof  weather.main !== "undefined") ? ((weather.main.temp > 16) ? 'wrapper warm' : 'wrapper') : 'wrapper' }>
            <main>
                <div className="searchBox">
                    <i className="icon"/>
                    <input type="text" className="searchInput" placeholder="Vyhledat..."
                           onChange={event => setQuery(event.target.value)} value={query} onKeyPress={search}/>
                </div>
                <Location/>
                {(typeof weather.main !== "undefined") ? (
                    <div>
                        <div className="locationWrapper">
                            <div className="location">{weather.name}, {weather.sys.country}</div>
                            <div className="date">{dateBuilder(new Date())}</div>
                        </div>
                        <div className="weatherWrapper">
                            <div className="temperature">
                                {Math.round(weather.main.temp)}°C
                            </div>
                            <div className="weather">
                                {weather.weather[0].description}
                            </div>
                        </div>
                    </div>
                ) : ('')}
            </main>
        </div>
    )
}

export default App;
