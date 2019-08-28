const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config({ path: '../config.env' });

const API_KEY = process.env.RIOT_API_KEY

function statusCheck(response){
    if(response.status != 200){
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }else{
        return response;
    }
}

exports.apiRequest = function(url){
    return fetch(url + 'api_key=' + API_KEY)
            .then(statusCheck)
            .then(function(response){
                return response.json();
            }).then(function(json){
                return json;
            }).catch(function(error){
                console.log(error);
            })
}

