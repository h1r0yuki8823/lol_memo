import React,{Component} from 'react'
import MatchBoard from './components/matchBoard'

class Top extends Component{


    render(){
        return(
            <div>
                <h1>Recently Match Info</h1>
                <MatchBoard userSummonerName="zer08823"/>
            </div>
        )
    }
}

export default Top