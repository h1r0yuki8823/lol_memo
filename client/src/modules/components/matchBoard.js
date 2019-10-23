import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import ChampionImg from './parts/championImg'

class MatchBord extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userSummonerName:this.props.userSummonerName,
            matchInfoData:[],
            participantIdentities:[],
            playerId0:[],
            teamData:[],
            win:false
        }
    }

    componentDidMount(){
        axios
            .get(
            'http://localhost:5000/jp1.api.riotgames.com/lol/summoner/v4/summoners/by-name/zer08823'
            )
            .then(res => {
                const data = res.data;
                this.setState({
                    matchInfoData:data,
                    participantIdentities:data['participantIdentities'],
                    playerId0:data['participantIdentities']['playerId0'],
                    teamData:data['teams']            
                })
                
                /*for(var i = 0; i< 10; i++){
                    console.log(this.state.matchInfoData['participantIdentities'][`playerId${i}`])
                }*/
                this.winDiscriment()
            })
    }

    winDiscriment(){
        var yourTeamId = 0
        for(var i = 0; i< 10; i++){
            
            if(this.state.userSummonerName === this.state.participantIdentities[`playerId${i}`]['summonerName']){
                yourTeamId = this.state.participantIdentities[`playerId${i}`]['teamId']
                continue
            }
        }
        
        if(this.state.teamData[0]['teamId'] === yourTeamId){
            if(this.state.teamData[0]['win'] === 'Win'){
                this.setState({win:true})
            }else{
                this.setState({win:false})
            }
        }else{
            if(this.state.teamData[1]['win'] === 'Win'){
                this.setState({win:true})
            }else{
                this.setState({win:false})
            }
        }
    }

    render(){
        const win = this.state.win
        
        return(
            <Container win>
                <p>{this.state.userSummonerName}</p>
                <p>{this.state.playerId0['summonerName']}</p>
                <ChampionImg championName={this.state.playerId0['championName']} />
            </Container>
        )
    }
}


const Container = styled.div`
    background: #E2B6B3;
    width: 100%;
    height: 320px;

    &[data-primary='true']{
        background: #A3CFEC;
    }
`

export default MatchBord