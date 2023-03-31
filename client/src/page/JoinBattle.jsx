import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { PageHOC, CustomButton } from '../components'
import styles from '../styles'

const JoinBattle = () => {
  const navigte = useNavigate()
  const {contract, gameData, setShowAlert, setBattleName, walletAddress, setErrorMessage } = useGlobalContext()
  const handleClick = async (battleName) => {
    setBattleName(battleName)

    try{
      await contract.joinBattle(battleName)

      setShowAlert({ 
        status: true,
        type: "success",
        message: `Joining ${battleName}`
      })
    }catch(error){
      setErrorMessage(error)
    }
  }
  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length 
          ? gameData.pendingBattles
          .filter((battle) => !battle.players.includes(walletAddress))
          .map((battle, index) => (
            <div key={battle.name + 1} className={styles.flexBetween}>
              <p className={styles.joinBattleTitle}> 
                {index + 1 }. {battle.name}
              </p>
              <CustomButton
                title="Join Battle"
                handleClick={() => handleClick(battle.name)}
              />
            </div>
          ))
        : <p className={styles.joinLoading}>Reload the page to see new battles</p>
        }
      </div>

      <p className={styles.infoText} onClick={() => navigte('/create-battle')}>Or create a new battle!</p>
    </>
  )
}

export default PageHOC(
    JoinBattle,
    <>Join <br/> a Battle</>,
    <>Join existing battles!</>
)