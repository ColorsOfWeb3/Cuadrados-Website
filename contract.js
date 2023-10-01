import contractABI from './web3/ABI.json' assert { type: "json" };

const contractAddress = '0x2bA9aD99995484cf9ad205f37d4Bd679a4a67281';

import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains
} from 'https://unpkg.com/@web3modal/ethereum@2.6.2'

import { Web3Modal } from 'https://unpkg.com/@web3modal/html@2.6.2'


const { polygonMumbai } = WagmiCoreChains;
const { configureChains, createConfig, switchNetwork, writeContract } = WagmiCore;


const chains = [polygonMumbai];
const projectId = "4134cb63bbad78412b5dcae41bc3d964";


const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})


const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient)
web3modal.setDefaultChain(polygonMumbai)

function connect() {
    web3modal.openModal();
}

async function changeNetwork() {
    await switchNetwork({
        chainId: 80001,
    });
}

function subscribe(callback) {
    web3modal.subscribeModal(newState => {
        callback();
    })
}

function account() {
    return WagmiCore.getAccount();
}

async function mint(tokenId) {
    try {
        const { hash } = await writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'mint',
            args: [tokenId],
            chainId: 80001
        })

        return {status: 'OK', value: hash}
    } catch (error) {
        return {status: 'KO', value: error}
    }
}

async function getOwner(tokenId) {
    try {
        const data = await readContract({
            address: contractAddress,
            abi: wagmigotchiABI,
            functionName: 'ownerOf',
            args: [tokenId],
            chainId: 80001
        })


        console.log('Minting transaction hash:', hash);
    } catch (error) {
        manageError(error, { tokenId: tokenId });
    }
}

export {
    connect,
    changeNetwork,
    subscribe,
    account,
    mint
}