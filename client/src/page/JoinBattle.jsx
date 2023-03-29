import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { PageHOC, CustomButton } from '../components'
import styles from '../styles'

const JoinBattle = () => {
    const navigte = useNavigate()

  return (
    <>
        <h2 className={styles.joinHeadText}>Available Battles:</h2>
        <p className={styles.infoText} onClick={() => navigte('/create-battle')}>Or create a new battle!</p>
    </>
  )
}

export default PageHOC(
    JoinBattle,
    <>Join <br/> a Battle</>,
    <>Join existing battles!</>
)