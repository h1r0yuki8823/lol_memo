import React from 'react'
import styled from 'styled-components'


class ChampionImg extends React.Component{
    
    constructor(props){
        
        super(props)
        this.state={
            championImgUrl:'',
            championName:this.props.championName
        }
    }

    componentDidMount(){

        this.setState({
            //championName:props.chmpionName,
            championImgUrl:`http://ddragon.leagueoflegends.com/cdn/9.16.1/img/champion/${this.props.chmpionName}.png`
        })
    }

    render(){
        return(
            <div>
                <p>{this.props.chmpionName}</p>
                <img  src={this.setState.championImgUrl}/>
            </div>
        )
    }
}

export default ChampionImg