const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config({ path: './config.env' });

const API_KEY = process.env.RIOT_API_KEY

router.get('/:summonerName', async(req, res) => {
    try{
        const summonerName = req.params.summonerName
        
        const response = await fetch(`https://jp1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)

        const data = await response.json()

        if(data.status.status_code === 404){
            return res.status(404).json({
                message: 'Profile Not Found'
            })
        }
        const accountId = data.accountId;

        const matchIdResponse = await fetch(`https://jp1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${API_KEY}`)
        const matchIdData = await matchIdResponse.json()
        const firstGameId = matchIdData.matches[0].gameId

        const matchDataResponse = await fetch(`https://jp1.api.riotgames.com/lol/match/v4/matches/${firstGameId}?api_key=${API_KEY}`)
        const matchData = await matchDataResponse.json()

        res.json(matchData);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Server error'
        })
    }
});

module.exports = router;
