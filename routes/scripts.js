const express = require('express');
const router = express.Router();

const nameSearch = require('../scripts/summonerNameSearch');

router.get('/summoner/:userID', function(req, res){
    let urlComponents = req.headers.host.split(':');

    nameSearch.searchSummoner(req.params.userID)
        .then(function(response){
            res.status(200).send(response);
        })
        .catch(function(err){
            res.send(err);
        })
})