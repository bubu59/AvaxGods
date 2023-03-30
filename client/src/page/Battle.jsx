import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from '../styles'
import { Alert } from '../components'
import { useGlobalContext } from '../context'
import {attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon} from "../assets"
import {playAudio} from '../utils/animation.js'

const Battle = () => {
    const { contract, walletAddress, showAlert, setShowAlert} = useGlobalContext()
    const [player01, setPlayer01] = useState({})
    const [player02, setPlayer02] = useState({})
    const { battleName } = useParams()
    const navigate = useNavigate()

  return (
    <div className={`${styles.flexBetween} ${styles.gameContainer} astral`}>
        <h1 className='text-xl'>{battleName}</h1>
    </div>
  )
}

export default Battle