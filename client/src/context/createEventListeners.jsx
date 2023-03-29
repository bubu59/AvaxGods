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
    setShowAlert
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
}