const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });



const app = express();

const allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','X-Requested-With');
    next();
}

app.use(allowCrossDomain)

app.use('/jp1.api.riotgames.com/lol/summoner/v4/summoners/by-name/',require('./routes/profile')); 



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

