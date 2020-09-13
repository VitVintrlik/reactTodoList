import React, {Component} from "react";

class Location extends Component {
    weatherApi = {
        key: "5f19c03a4c8370148cb0abfc7bf6ce8d",
        base: "https://api.openweathermap.org/data/2.5/"
    }
    initialState = {
        weather: null,
        name: null,
        country: null,
        description: null,
        temperature: null,
        wind: null,
        humidity: null,
        sunrise: null,
        sunset: null
    }

    constructor() {
        super();
        this.state = this.initialState
    }


    componentDidMount() {
        this.getLocation()
    }

    resetState() {
        this.setState(this.initialState)
    }

    changeState(json) {
        this.setState({
            weather: json,
            name: json.name,
            country: json.sys.country,
            description: json.weather[0].description,
            temperature: json.main.temp,
            wind: json.wind.speed,
            humidity: json.main.humidity,
            sunrise: json.sys.sunrise,
            sunset: json.sys.sunset
        })
    }

    dateBuilder = (d) => {
        let months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červecen", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]
        let days = ["Sobota", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Neděle"]

        let day = days[d.getDay()]
        let date = d.getDate()
        let month = months[d.getMonth()]
        let year = d.getFullYear()

        return `${day} ${date}. ${month} ${year}`
    }

    getAddress(latitude, longitude) {
        let self = this
        let request = new XMLHttpRequest()

        let method = 'GET'
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=AIzaSyB0j2FAU9ZSzY8tg-G94tLTjLec7xXiBts'
        let async = true

        request.open(method, url, async)
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let data = JSON.parse(request.responseText)
                let addressJSON = data.results[0].address_components
                const city = self.getCityName(addressJSON)
                self.getWeatherOnLoad(city)
            }
        }
        request.send()
    }

    getCityName(addressComponents) {
        for (const addressComponent of addressComponents) {
            for (const type of addressComponent.types) {
                if (type === "locality" || type === "political") {
                    return addressComponent.long_name;
                }
            }
        }
    }

    getLocation() {
        let self = this
        let success = function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            self.getAddress(latitude, longitude)
        }

        let error = function (err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        if (!navigator.geolocation) {
            alert("Geolokace neni podporovana vasim prohlizecem")
        } else {
            navigator.geolocation.getCurrentPosition(success, error)
        }
    }

    getWeatherOnLoad(city) {
        fetch(`${this.weatherApi.base}weather?q=${city}&units=metric&APPID=${this.weatherApi.key}&lang=cz`)
            .then(response => response.json()).then(json => {
            this.changeState(json)
        })
    }

    calculateTime(timeInt) {
        const newDate =  new Date(timeInt * 1000)
        return newDate.getHours() + ":" + newDate.getMinutes()
    }

    speedUnitConvert(mps) {
        return Math.round(mps * 3.6);
    }

    firstLetterCapital(string){
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    search = event => {
        if (event.key === "Enter") {
            const query = document.getElementsByClassName("searchInput")[0].value
            fetch(`${this.weatherApi.base}weather?q=${query}&units=metric&APPID=${this.weatherApi.key}&lang=cz`)
                .then(response => response.json())
                .then(weatherResult => {
                    if (weatherResult.cod !== "404") {
                        this.changeState(weatherResult)
                    } else {
                        this.resetState()
                    }
                })
        }
    }

    render() {
        console.log("rendering")
        return (
            <>
                <div className="searchBox">
                    <i className="icon"/>
                    <input type="text" className="searchInput" placeholder="Vyhledat..."
                           onKeyPress={this.search}/>
                </div>
                <div>
                    {(this.state.name) ? (
                        <>
                            <div className="locationWrapper">
                                <div className="location">{this.state.name}, {this.state.country}</div>
                                <div className="date">{this.dateBuilder(new Date())}</div>
                            </div>
                            <div className="weatherWrapper">
                                <div className="weatherInfoContainer">
                            <span
                                className="temperature">{Math.round(this.state.temperature)}°C {this.firstLetterCapital(this.state.description)}</span><br/>
                                    <span className="humidity">Vlhkost vzduchu: {this.state.humidity}%</span><br/>
                                    <span
                                        className="wind">Rychlost vetru: {this.speedUnitConvert(this.state.wind)}km/h</span><br/>
                                    <div className="timeContainer">
                                        <span
                                            className="sunrise">Vychod slunce: {this.calculateTime(this.state.sunrise)}</span>
                                        <span
                                            className="sunrise">Zapad slunce: {this.calculateTime(this.state.sunset)}</span>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="weatherWrapper">
                                <div className="weatherInfoContainer nonexistent">
                                    Zadané město neexistuje
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </>
        )
    }
}


export default Location;


