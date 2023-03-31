import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import {ethers} from 'ethers'
import Web3Modal, { local } from 'web3modal'
import { useNavigate } from 'react-router-dom'
import { ABI,ADDRESS } from '../contract'
import { createEventListeners } from './createEventListeners'
import { GetParams } from '../utils/onboard'

const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const navigate = useNavigate()
    const [walletAddress, setWalletAddress] = useState('')
    const [provider, setProvider] = useState('')
    const [contract, setContract] = useState('')
    const [showAlert, setShowAlert] = useState({
        status: false,
        type:'info',
        message: ''
    })
    const [battleName, setBattleName] = useState('')
    const [gameData, setGameData] = useState({
        players: [],
        pendingBattles: [],
        activeBattle: null
    })
    const [updateGameData, setUpdateGameData] = useState(0)
    const [battleGround, setBattleGround] = useState('bg-astral')
    const [step, setStep] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')

    //* Checking for battleground from local storage 
    useEffect(() => {   
        const battleGroundFromLocalStorage = localStorage.getItem('battleground')
        if(battleGroundFromLocalStorage) {
            setBattleGround(battleGroundFromLocalStorage)
        } else {
            localStorage.setItem('battleground', battleGround)
        }

    })

    //* Reset web3 onboarding modal params 
    useEffect(() => {
        const resetParams = async () => {
            const currentStep = await GetParams()

            setStep(currentStep.step)
        }
        resetParams()
        window?.ethereum.on('chainChanged', () => resetParams())
        window?.ethereum.on('accountsChanged', () => resetParams())
    }, [])

    //* Set the wallet address
    const updateCurrentWalletAddress = async () => {
        const accounts = await window?.ethereum?.request({
            method:'eth_accounts'
        })
        if(accounts) {
            setWalletAddress(accounts[0])
        }
    }

    useEffect(() =>{
        updateCurrentWalletAddress()
        window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress)
    }, [])

    //*set the smart contract and wallet provider
    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3modal = new Web3Modal()
            const connection = await web3modal.connect()
            const newProvider = new ethers.providers.Web3Provider(connection)
            const signer = newProvider.getSigner()
            const newContract = new ethers.Contract(ADDRESS, ABI, signer)

            setProvider(newProvider)
            setContract(newContract)
        }
        setSmartContractAndProvider()
    }, [])

    useEffect(() => {
        console.log(contract)
        if(step !== -1 && contract) {
        createEventListeners({
            navigate, 
            provider, 
            contract, 
            walletAddress, 
            setShowAlert,
            setUpdateGameData
        })
        }
    }, [contract, step])

    useEffect(() => {
        if(showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({status: false, type:'info', message: ''})
            }, [5000])

            return () => clearTimeout(timer)
        }
    }, [showAlert])

    //* Handle error messages
    useEffect(() => {
        if(errorMessage) {
            const parsedErrorMessage = errorMessage?.data?.message.slice('execution reverted: '.length).slice(0,-1)
            // slice('execution reverted : '.length).slice(0,-1)
            if(parsedErrorMessage) {
                setShowAlert({
                    status: true,
                    type: 'failure',
                    message: parsedErrorMessage
                })
            }
        }
    }, [errorMessage])

    //*Set game data 
    useEffect(() => {
        const fetchGameData = async () => {
            const fetchedBattles = await contract.getAllBattles()
            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0)
            let activeBattle = null
            fetchedBattles.forEach((battle) => {
                if(battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
                    if(battle.winner.startsWith('0x00')) {
                        activeBattle = battle
                    }
                }
            })
            setGameData({pendingBattles: pendingBattles.slice(1), activeBattle})
            // console.log(fetchedBattles)
        }
        if (contract) fetchGameData()
    }, [contract, updateGameData])

    return (
        <GlobalContext.Provider value={{ 
            contract, 
            walletAddress, 
            showAlert, 
            setShowAlert,
            battleName,
            setBattleName,
            gameData,
            battleGround,
            setBattleGround,
            errorMessage,
            setErrorMessage
        }}>
            {children}
        </GlobalContext.Provider>   
    )
}

export const useGlobalContext = () => useContext(GlobalContext)