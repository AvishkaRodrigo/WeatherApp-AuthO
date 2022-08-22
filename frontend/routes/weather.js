const router = require('express').Router();

router.get('/',(req,res) => {
    res.render('dashboard');
})

router.post('/', async (req, res) => {

    var CityCode = '524901'
    const url_api = `https://samples.openweathermap.org/data/2.5/group?id=${citiCodes}&units=imperial&appid=3ff35566d4d323288e09f0fd65c9953a`;

//   try {
//     await fetch(url_api)
//       .then(res => res.json())
//       .then(data => {
//           console.log(data);
//       });

//   } catch (err) {
//     console.log(err)
//     }


    async function postData(url_api){
        const response = await fetch(url_api,{ method:'POST'});
        console.log(response.json())
        return response.json();
    }
    
    postData(url_api);

})



module.exports = router;