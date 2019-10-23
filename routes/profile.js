const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('fs')

dotenv.config({ path: './config.env' });

const API_KEY = process.env.RIOT_API_KEY

var championDict = {}
const championJson = JSON.parse(fs.readFileSync('routes/champion.json','utf8'))
var i = 0
for(var champion in championJson['data']){
    
    var championKey = championJson['data'][champion]['key']  
    championDict[championKey] = champion

}

/*
for(var i = 0; i < Object.keys(championJson['data']).length; i++){
    
    //championDict[championJson['data'][i]['key']] = [championJson['data'][i]['name']]
    //console.log(championDict)
}*/

router.get('/:summonerName', async(req, res) => {
    try{
        const summonerName = req.params.summonerName
        
        const response = await fetch(`https://jp1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)

        const data = await response.json()

        /*if(data.status.status_code === 404){
            return res.status(404).json({
                message: 'Profile Not Found'
            })
        }*/
        const accountId = data.accountId;

        const matchIdResponse = await fetch(`https://jp1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${API_KEY}`)
        const matchIdData = await matchIdResponse.json()
        
        const firstGameId = matchIdData.matches[0].gameId

        const matchDataResponse = await fetch(`https://jp1.api.riotgames.com/lol/match/v4/matches/${firstGameId}?api_key=${API_KEY}`)
        const matchData = await matchDataResponse.json()
        //json_organize(matchData);
        //res.json(matchData);
        res.json(
            json_organize(matchData)
        )
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Server error'
        })
    }
});

function json_organize(json_data){
    matchPlayerIdList = ["playerId0","playerId1","playerId2","playerId3","playerId4","playerId5","playerId6","playerId7","playerId8","playerId9"]
    participants = json_data['participants']
    participantIdentities = json_data['participantIdentities']
    teams = json_data['teams']
    
    //変数dataに変換したjsonデータを入れる
    var data = {}
    //10プレイヤー分の情報を持った連想配列
    var match_player_dict = {}
    //両チームごとのデータ
    team1InfoDict = {}
    team2InfoDict = {}
    //上記のデータを一つのリストに入れる
    bothTeamData = []

    //10プレイヤー分のjsonを作る処理
    for(var i=0; i < 10; i++){
        var participantsData = participants[i]
        var playerInfoData = {}
        playerInfoData['summonerName'] = participantIdentities[i]['player']['summonerName']
        playerInfoData['teamId'] = participantsData['teamId']
        playerInfoData['championId'] = participantsData['championId']
        playerInfoData['championName'] = championDict[participantsData['championId']]
        playerInfoData['spell1Id'] = participantsData['spell1Id']
        playerInfoData['spell2Id'] = participantsData['spell2Id']
        playerInfoData['item0'] = participantsData['stats']['item0']
        playerInfoData['item1'] = participantsData['stats']['item1']
        playerInfoData['item2'] = participantsData['stats']['item2']
        playerInfoData['item3'] = participantsData['stats']['item3']
        playerInfoData['item4'] = participantsData['stats']['item4']
        playerInfoData['item5'] = participantsData['stats']['item5']
        playerInfoData['item6'] = participantsData['stats']['item6']
        playerInfoData['perkPrimaryStyle'] = participantsData['stats']['perkPrimaryStyle']
        playerInfoData['perkSubStyle'] = participantsData['stats']['perkSubStyle']
        playerInfoData['perk0'] = participantsData['stats']['perk0']
        playerInfoData['perk1'] = participantsData['stats']['perk1']
        playerInfoData['perk2'] = participantsData['stats']['perk2']
        playerInfoData['perk3'] = participantsData['stats']['perk3']
        playerInfoData['perk4'] = participantsData['stats']['perk4']
        playerInfoData['perk5'] = participantsData['stats']['perk5']
        playerInfoData['totalDamegeTaken'] = participantsData['stats']['totalDamageTaken']
        playerInfoData['kills'] = participantsData['stats']['kills']
        playerInfoData['deaths'] = participantsData['stats']['deaths']
        playerInfoData['assists'] = participantsData['stats']['assists']
        playerInfoData['wardsPlaced'] = participantsData['stats']['wardsPlaced']
        playerInfoData['totalMinionsKilled'] = participantsData['stats']['totalMinionsKilled']

        match_player_dict[matchPlayerIdList[i]] = playerInfoData
    }

    team1InfoDict['teamId'] = teams[0]['teamId']
    team1InfoDict['win'] = teams[0]['win']
    team1InfoDict['towerKills'] = teams[0]['towerKills']
    team1InfoDict['dragonKills'] = teams[0]['dragonKills']
    team1InfoDict['baronKills'] = teams[0]['baronKills']
    team1InfoDict['firstRiftHerald'] = teams[0]['firstRiftHerald']
    
    team2InfoDict['teamId'] = teams[1]['teamId']
    team2InfoDict['win'] = teams[1]['win']
    team2InfoDict['towerKills'] = teams[1]['towerKills']
    team2InfoDict['dragonKills'] = teams[1]['dragonKills']
    team2InfoDict['baronKills'] = teams[1]['baronKills']
    team2InfoDict['firstRiftHerald'] = teams[1]['firstRiftHerald']

    bothTeamData.push(team1InfoDict)
    bothTeamData.push(team2InfoDict)

    data['seasonId'] = json_data['seasonId']
    data['queueId'] = json_data['queueId']
    data['participantIdentities'] = match_player_dict
    data['teams'] = bothTeamData
    console.log(data)

    
    //console.log(match_player_dict)

    return data
}

module.exports = router;
