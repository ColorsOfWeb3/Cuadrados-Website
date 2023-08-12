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

async function mint(tokenId) {
    try {
        const { hash } = await writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'mint',
            args: [tokenId],
            chainId: 80001
        })


        console.log('Minting transaction hash:', hash);
    } catch ({ name, message }) {
        manageError(name, message, { tokenId: tokenId });
    }
}

async function manageError(name, message, options) {
    switch (name) {
        case "ConnectorNotFoundError":
            web3modal.openModal();
            break;
        case "ChainMismatchError":
            try {
                const network = await switchNetwork({
                    chainId: 80001,
                });
                mint(options.tokenId);
            } catch (error) {
                alert("Network error: Switch to Polygon Mumbai")
            }
            break;
        default:
            console.error('Error:', message);
    }
}

window.addEventListener('load', async () => {
    web3modal.openModal()
});

export {
    mint
}