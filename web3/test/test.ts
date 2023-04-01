import { expect } from "chai";
import { ethers } from "hardhat";

async function deploy(name: string, ...params: [string]) {
    const contractFactory = await ethers.getContractFactory(name);
    return await contractFactory.deploy(...params).then((f) => f.deployed());
  }
const _metadataUri = 'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';

const p1Name = 'p1'
const p1Token = 'p1Token'

describe("AvaxGods tests", function() {

    //test for deploy contract 
    it("Should deploy new contract", async function () {
        const [admin] = await ethers.getSigners()
        console.log(`Deploying a smart contract...`)
        const AVAXGods = (await deploy('AVAXGods', _metadataUri)).connect(admin);

        console.log({ AVAXGods: AVAXGods.address });
    })

    //test for register player
    it("Should register new player", async function() {
        const [admin, addr1] = await ethers.getSigners()
        console.log(`Deploying a smart contract...`)
        const AVAXGods = (await deploy('AVAXGods', _metadataUri)).connect(admin);

        await AVAXGods.connect(addr1).registerPlayer('p1', 'p1Token')

        const newPlayer = await AVAXGods.getAllPlayers()
        console.log('New player successfully created!',newPlayer)
    })
    //test for create-battle 

    //test for join-battle 

})