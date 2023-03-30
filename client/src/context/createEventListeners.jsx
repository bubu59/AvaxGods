import { ethers } from "ethers";
import { ABI } from "../contract";

const addNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter) // to ensure no multiple listeners for the same event 
    provider.on(eventFilter, (Logs) => {
        const parsedLogs = (new ethers.utils.Interface(ABI)).parseLog(Logs)
        cb(parsedLogs)
    })
}

export const createEventListeners = ({ 
    navigate, 
    provider, 
    contract, 
    walletAddress, 
    setShowAlert,
    setUpdateGameData
}) => {
    console.log(contract)
    const NewPlayerEventFilter = contract.filters.NewPlayer()
    addNewEvent(NewPlayerEventFilter, provider, ({args}) => {
        console.log('New player created!', args)

        if(walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: "Player has been successfully registered!"
            })
        }
    })

    const NewBattleEventFilter = contract.filters.NewBattle()
    addNewEvent(NewBattleEventFilter, provider, ({args}) => {
        console.log('New battle started!', args, walletAddress)

        if(walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
            navigate(`/battle/${args.battleName}`)
        }
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1)
    })

}