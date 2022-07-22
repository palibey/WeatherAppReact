import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const ankara = [39, 32];
const texas = [31, -99];
const uk = [55, -3];

class WeatherApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentData: [],
        };
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(e) {
        let collection = e.target.options;
        let arr = [];
        for (let i = 0; i < collection.length; i++) {
            if (collection[i].selected)
                arr.push(collection[i].value);
        }
        this.setState({
            currentData: this.selectComp(arr).slice(),

        })
    }
    coordinateGiver(name){
        if (name === 'US'){
            return texas;
        }else if (name === 'GB'){
            return uk;
        }else{
            return ankara;
        }
    }
    selectComp(nameArr) {
        const newList = [];
        for (let i = 0; i < nameArr.length; i++) {
            fetch('https://api.openweathermap.org/data/2.5/weather?lat='
                + this.coordinateGiver(nameArr[i])[0] + '&lon='
                + this.coordinateGiver(nameArr[i])[1] + '&appid='
                + '8ceaf8462e60a49d7e34381c5afcb18e')
                .then(r => r.json())
                .then(data => newList.push(data));
        }
        return newList;
    }

    render() {
        let allWeather = [];
        let allExtra = [];
        console.log(this.state.currentData.length);
        console.log(this.state.currentData);
        for (let i = 0; i < this.state.currentData.length; i++) {
            console.log(this.state.currentData);
            let myNum = this.state.currentData[i].main.feels_like;
            myNum -= 273.15;
            myNum = Number(myNum).toFixed(2);
            var sunrise = this.state.currentData[i].sys.sunrise;
            var sunset = this.state.currentData[i].sys.sunset;
            var parsedSunrise = new Date(sunrise * 1000);
            var parsedSunset = new Date(sunset * 1000);
            allWeather.push(
                <WeatherInfo
                country={this.state.currentData[i].sys.country}
                description={parse1(this.state.currentData[i].weather)}
                feelsLike={myNum}
                />
            )
            allExtra.push(
                <ExtraInfo
                humidity={this.state.currentData[i].main.humidity}
                pressure={this.state.currentData[i].main.pressure}
                sunrise={parsedSunrise}
                sunset={parsedSunset}
                />
            )
        }

        return (
            <div className="weatherApp">
                <div className="header-info">
                    <div className="select">
                        <label className="main-text">
                            Select City
                            <select multiple="multiple" size="3" onChange={this.handleChange}>
                                <option key='1' value={"TR"}>Ankara</option>
                                <option key='2' value={"US"}>Texas</option>
                                <option key='3' value={'GB'}>UK</option>
                            </select>
                        </label>
                    </div>
                </div>
                {allWeather}
                {allExtra}
            </div>
        );
    }


}


function WeatherInfo(props) {
    return (
        <div className="weather-info">
            <div className="country"><p><b>Country :</b> {props.country}  </p></div>
            <div className="description"><p><b>Description :</b>{props.description}</p></div>
            <div className="temperature"><p><b>Feels Like :</b>{props.feelsLike}</p></div>
        </div>
    );
}

function ExtraInfo(props) {
    return (
        <div className="extra-box">
            <div className="extra-info"><p><b>Humidity :</b>{props.humidity}</p></div>
            <div className="extra-info"><p><b>Pressure :</b>{props.pressure}</p></div>
            <div className="sun-info"><p><b>Sunset :</b>{props.sunset.toString()}</p></div>
            <div className="sun-info"><p><b>Sunrise :</b>{props.sunrise.toString()}</p></div>
        </div>
    );


}

function parse1(obj) {
    return obj[0].description.toUpperCase();
}


root.render(<WeatherApp/>);