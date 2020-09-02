import React, { Component } from "react";

class Location extends Component {
    weatherApi = {
        key: "5f19c03a4c8370148cb0abfc7bf6ce8d",
        base: "https://api.openweathermap.org/data/2.5/"
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
                let address = data.results[0]
                self.getWeatherOnLoad(address.formatted_address)
            }
        }
        request.send()
    }

    getLocation() {
        let self = this
        let success = function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            self.getAddress(latitude, longitude)
        }
        let error = function (){
            console.log("err")
        }
        if (!navigator.geolocation) {
            alert("Geolokace neni podporovana vasim prohlizecem")
        } else {
            navigator.geolocation.getCurrentPosition(success, error)
        }

    }

    getWeatherOnLoad(city){
        console.log(city)
        fetch(`${this.weatherApi.base}weather?q=${city}&units=metric&APPID=${this.weatherApi.key}&lang=cz`)
            .then(response => {
                let json = response.json()
                console.log( json)
            })
    }

    renderWeather(weather){
        console.log(weather)
            return (
                <div>
                    <div className="locationWrapper">
                        <div className="location">{weather.name}, {weather.sys.country}</div>
                        <div className="date">{this.dateBuilder(new Date())}</div>
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
            )
    }
}
export default Location;
