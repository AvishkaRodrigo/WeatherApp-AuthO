const express = require('express');
const router = require('express').Router;
const request = require('request');
require('dotenv').config()
const userRequest = require('./data/cities.json')

const app = express();
const port = process.env.PORT;

app.locals.themeToggle = () => {
    var themeToggle = document.getElementById('theme');
    var element = document.getElementById('card-item');
    if (themeToggle.checked == true) {
        element.classList.add('theme-light');
    }else {
        element.classList.add('theme-dark');
    }
};



app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// const weatherRouter = require('./routes/weather');
var userRequestData = JSON.parse(JSON.stringify(userRequest.List));

var requestDataArr = Object.keys(userRequestData).map((key) => [userRequestData[key].CityCode]);
cityCodes = requestDataArr.join();
// console.log(requestDataArr.join());

var weatherData;
var Data;
app.get('/', (req,res) => {
    var url = `http://api.openweathermap.org/data/2.5/group?id=${cityCodes}&units=metric&appid=${process.env.API_KEY}`;
    request(url, function(err, response, body){
        if(err){
            res.render('dashboard', { weather: null, error: 'Error, please try again' });
            // ! enter code here
        }else{
            weatherData = JSON.parse(body);
            getData(weatherData);
            // console.log(getData(weatherData));
        }
        Data = getData(weatherData);
        // console.log(Data);
        res.render('dashboard', {Data});
    })
});


const getData = (responseData) => {
    var data = JSON.parse(JSON.stringify(responseData.list));

    var result = Object.keys(data).map((key) => [data[key].id, data[key].name, data[key].main.temp, data[key].weather[0].description, data[key].weather[0].icon]);
    // console.log(result);
    return result;
} 

app.listen(port, () => console.info('App is listing on port!'));
