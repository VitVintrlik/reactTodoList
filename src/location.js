import  React, {Component, useState} from "react";

class Location extends Component {
    weatherApi = {
        key: "5f19c03a4c8370148cb0abfc7bf6ce8d",
        base: "https://api.openweathermap.org/data/2.5/"
    }

    constructor() {
        super();
        this.state = {
            weather: null,
            name: null,
            country: null,
            description: null,
            temperature: null
        }
        this.getLocation()
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

    getCityName(addressComponents){
        for(const addressComponent of addressComponents) {
            for(const type of addressComponent.types){
                if(type === "locality" || type === "political"){
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
        console.log(city)
        fetch(`${this.weatherApi.base}weather?q=${city}&units=metric&APPID=${this.weatherApi.key}&lang=cz`)
            .then(response => response.json()).then(json => {
                this.setState({
                    weather: json,
                    name: json.name,
                    country: json.sys.country,
                    description: json.weather[0].description,
                    temperature: json.main.temp
                })
            console.log("cityLoad")
        })
    }




    render() {

        console.log("rendering")
        return (
            <div>
                <div className="locationWrapper">
                    <div className="location">{this.state.name}, {this.state.country}</div>
                    <div className="date">{this.dateBuilder(new Date())}</div>
                </div>
                <div className="weatherWrapper">
                    <div className="temperature">
                        {Math.round(this.state.temperature)}°C
                    </div>
                    <div className="weather">
                        {this.state.description}
                    </div>
                </div>
            </div>
        )
    }
}

export default Location;


