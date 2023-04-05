import { ethers } from "ethers";
import { defenseSound } from "../assets";
import { ABI } from "../contract";
import {playAudio, sparcle } from '../utils/animation.js'

const emptyAccount = '0x0000000000000000000000000000000000000000';

const addNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter) // to ensure no multiple listeners for the same event 
    provider.on(eventFilter, (Logs) => {
        const parsedLogs = (new ethers.utils.Interface(ABI)).parseLog(Logs)
        cb(parsedLogs)
    })
}

const getCoords = (cardRef) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()

    return {
        pageX: left + width /2,
        pageY: top + height / 2.25
    }
}

export const createEventListeners = ({ 
    navigate, 
    provider, 
    contract, 
    walletAddress, 
    setShowAlert,
    setUpdateGameData,
    player01Ref,
    player02Ref
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

    const NewGameTokenEventFilter = contract.filters.NewGameToken()
    addNewEvent(NewGameTokenEventFilter, provider, ({args}) => {
        console.log("New game token created!", args)

        if(walletAddress.toLowerCase() === args.owner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player game token has been successfully created!'
            })

            navigate('/create-battle')
        }
    })


    const BattleMoveEventListener = contract.filters.BattleMove()
    addNewEvent(BattleMoveEventListener, provider, ({args}) => {
        console.log('Battle move initiated!', args)
    })

    const RoundEndedEventFilter = contract.filters.RoundEnded()
    addNewEvent(RoundEndedEventFilter, provider, ({args}) => {
        console.log('Round eneded initiated!', args, walletAddress)

        for (let i = 0; i < args['damagedPlayers'].length; i += 1) {
            if(args['damagedPlayers'][i] !== emptyAccount) {
                if(args['damagedPlayers'][i] === walletAddress) {
                    sparcle(getCoords(player01Ref))
                } else if(args['damagedPlayers'][i] !== walletAddress) {
                    sparcle(getCoords(player02Ref))
                }
            } else {
                playAudio(defenseSound)
            }
        }

        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1)
    })

    const BattleEndedEventFilter = contract.filters.BattleEnded()
    addNewEvent(BattleEndedEventFilter, provider, ({args}) => {
        console.log('Battle ended!', args, walletAddress)
        if(walletAddress.toLowerCase() === args.winner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'You won!'
            })
        } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'failure',
                message: 'You lost!'
            })
        }

        navigate('/create-battle')
    })
}    