const express = require('express');

const app = express();
const port = 5000;

app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    res.render('dashboard');
})

app.listen(port, () => console.info('App is listing on port!'));