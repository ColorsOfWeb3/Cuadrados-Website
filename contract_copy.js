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

window.addEventListener('load', async () => {
  await web3modal.openModal();
});