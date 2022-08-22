
const getData = () => {
    fetch('https://samples.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=imperial&appid=3ff35566d4d323288e09f0fd65c9953a')
    .then((response) => response.json())
    .then((data) => console.log(data));

}

getData();
