import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from '../styles'
import { Alert, PlayerInfo, GameInfo, Card, ActionButton } from '../components'
import { useGlobalContext } from '../context'
import {attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon} from "../assets"
import {playAudio} from '../utils/animation.js'

const Battle = () => {
    const { contract, walletAddress, showAlert, setShowAlert, battleGround, gameData} = useGlobalContext()
    const [player01, setPlayer01] = useState({})
    const [player02, setPlayer02] = useState({})
    const { battleName } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getPlayerInfo = async() => {

            try{
                let player01Address = null
                let player02Address = null
                
                if(gameData.activeBattle.players[0].toLowerCase() === walletAddress.toLowerCase()) {
                    player01Address = gameData.activeBattle.players[0]
                    player02Address = gameData.activeBattle.players[1]
                } else {
                    player01Address = gameData.activeBattle.players[1]
                    player02Address = gameData.activeBattle.players[0]
                }

                const p1TokenData = await contract.getPlayerToken(player01Address)
                const player01 = await contract.getPlayer(player01Address)
                const player02 = await contract.getPlayer(player02Address)

                const p1Att = p1TokenData.attackStrength.toNumber()
                const p1Def = p1TokenData.defenseStrength.toNumber()
                const p1H = player01.playerHealth.toNumber()
                const p1M = player01.playerMana.toNumber()
                const p2H = player02.playerHealth.toNumber()
                const p2M = player02.playerMana.toNumber()

                setPlayer01({...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M })
                setPlayer02({...player02, att: 'X', def: 'X', health: p2H, mana: p2M })

            }catch(error){
                console.log(error)
            }
        }

        if(contract && gameData.activeBattle) {
            getPlayerInfo()
        }

    }, [contract, gameData, battleGround])

  return (
    <div className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}>
         {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message}/>}
        
        <PlayerInfo 
            player={player02}
            playerIcon={player02Icon}
            mt
        />

        <div className={`${styles.flexCenter} flex-col my-10`}>
            <Card
                card={player02}
                title={player02?.playerName}
                cardRef=''
                playerTwo
            />

            <div className='flex items-center flex-row'>
                <ActionButton   
                    imgUrl={attack}
                    handleClick={() => {}}
                    restStyles='mr-2 hover:border-yellow-400'
                />
                <Card
                    card={player01}
                    title={player01?.playerName}
                    cardRef=''
                    restStyles='mt-3'
                />
                <ActionButton   
                    imgUrl={defense}
                    handleClick={() => {}}
                    restStyles='ml-6 hover:border-red-600'
                />
            </div>
        </div>

        <PlayerInfo 
            player={player01}
            playerIcon={player01Icon}
            mt
        />

        <GameInfo/>
    </div>
  )
}

export default Battle