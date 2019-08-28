exports.searchSummoner = function(name){
    let requester = require('./httpGetReauest');

    let byNameUrl = 'https://jp1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';

    let preparedUrl = byNameUrl + name + '?';

    return requester.apiRequest(preparedUrl);
}