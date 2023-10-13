import contractABI from './web3/ABI.json' assert { type: "json" };

const contractAddress = '0xF5e6ec4f23b9318Ab52Ab86B35A65eB8c556C193';

import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains
} from 'https://unpkg.com/@web3modal/ethereum@2.6.2'

import { Web3Modal } from 'https://unpkg.com/@web3modal/html@2.6.2'


const { mainnet } = WagmiCoreChains;
const { configureChains, createConfig, switchNetwork, writeContract, readContract } = WagmiCore;


const chains = [mainnet];
const projectId = "4134cb63bbad78412b5dcae41bc3d964";


const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})


const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient)
web3modal.setDefaultChain(mainnet)

function connect() {
    web3modal.openModal();
}

async function changeNetwork() {
    await switchNetwork({
        chainId: 1,
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
        const response = await mintPrice()
        if (response.status == 'OK') {
            const { hash } = await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'mint',
                args: [tokenId],
                value: response.value,
                chainId: 1
            })
    
            return {status: 'OK', value: hash}
        } else {
            return {status: 'KO', value: response.value}
        }
    } catch (error) {
        return {status: 'KO', value: error}
    }
}

async function mintPrice() {
    try {
        const data = await readContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'mintPrice',
            chainId: 1
        })

        return {status: 'OK', value: data}
    } catch (error) {
        return {status: 'KO', value: error}
    }
}

export {
    connect,
    changeNetwork,
    subscribe,
    account,
    mint
}