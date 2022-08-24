const express = require('express');
const request = require('request');
const userRequest = require('./data/cities.json');
const NodeCache = require('node-cache');
const { auth, requiresAuth } = require('express-openid-connect');

require('dotenv').config();

const app = express();
const Localcache = new NodeCache({stdTTL:300});

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
// var userRequestData = JSON.parse(JSON.stringify(userRequest.List));
var userRequestData = userRequest.List;

var requestDataArr = Object.keys(userRequestData).map((key) => [userRequestData[key].CityCode]);
cityCodes = requestDataArr.join();
// console.log(requestDataArr.join());


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.use(auth(config));


    var weatherData;
    var Data;

// req.isAuthenticated is provided from the auth router
app.get('/', requiresAuth(), (req, res) => {

    if(req.oidc.isAuthenticated){
        var url = `http://api.openweathermap.org/data/2.5/group?id=${cityCodes}&units=metric&appid=${process.env.API_KEY}`;
        if (Localcache.has('weatherdata')){
            var Data = getData(weatherData);
            // console.log(Data)
            console.log('taken from cache')
            return res.render('dashboard',{Data})
        }else {
            request(url, function(err, response, body){
                if(err){
                    res.render('dashboard', { weather: null, error: 'Error, please try again' });
                    // ! enter code here
                }else{
                    weatherData = JSON.parse(body);
                    // getData(weatherData);
                    // console.log(getData(weatherData));
                    // sessionStorage.setItem('weatherAPIdata','Data');
                }
                Data = getData(weatherData);
                // console.log(sessionStorage.getItem('weatherAPIdata'));
                // console.log(Data);
                
                Localcache.set('weatherdata',Data);
                console.log('taken from API')
                // console.log(typeof weatherData)
                return res.send('dashboard', 
                {Data}, 
                {
                    isAuthenticated: req.oidc.isAuthenticated(),
                    user: req.oidc.user,
                });
            })
        }
        // res.send('/login')
    }else{
        res.send('logout')
    }
    // res.send(req.oidc.isAuthenticated() ? '/dashboard' : 'Logged out');
});

app.use('/logout', (req, res) => res.send('logout'));

const getData = (responseData) => {
    var data = responseData.list;

    var result = Object.keys(data).map((key) => [data[key].id, data[key].name, data[key].main.temp, data[key].weather[0].description, data[key].weather[0].icon]);
    // console.log(result);
    return result;
} 

app.listen(process.env.PORT, () => console.info('App is listing on port!'));