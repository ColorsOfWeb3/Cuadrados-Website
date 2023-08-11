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

window.addEventListener('load', () => {
    connect();
});

export {
    mint,
    maxSupply
}