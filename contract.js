import contractABI from './web3/ABI.json' assert { type: "json" };

const contractAddress = '0x2bA9aD99995484cf9ad205f37d4Bd679a4a67281';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function connect() {
    if (window.ethereum) {

        await window.ethereum.request({ method: "eth_requestAccounts" });

    } else {
        console.log("No wallet");
    }
}

async function mint(tokenId) {
    try {
        const mintPrice = await contract.mintPrice();
        const gasPrice = await provider.getGasPrice();
        const gasLimit = 300000; // You may adjust the gas limit based on your contract

        const tx = await contract.mint(tokenId, {
            value: mintPrice, // Use the current mintPrice for payment
            gasPrice,
            gasLimit
        });

        await tx.wait();
        console.log('Transaction hash:', tx.hash);
    } catch (error) {
        console.error('Error minting token:', error);
    }
}

async function maxSupply() {
    try {
        const maxSupply = await contract.maxSupply();
        console.log("maxSupply:", Number(maxSupply));
        return Number(maxSupply)
    } catch (error) {
        console.error("Error:", error);
    }
}

window.addEventListener('load', async () => {
    //connect();
    await web3modal.openModal()
});

import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains
} from 'https://unpkg.com/@web3modal/ethereum'

import { Web3Modal } from 'https://unpkg.com/@web3modal/html'

// Equivalent to importing from @wagmi/core
const { configureChains, createConfig } = WagmiCore

// Equivalent to importing from @wagmi/core/chains
const { mainnet, polygonMumbai} = WagmiCoreChains

const chains = [mainnet, polygonMumbai]
const projectId = '4134cb63bbad78412b5dcae41bc3d964'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)

export {
    mint,
    maxSupply
}