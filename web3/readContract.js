const fs = require("fs");
const { Web3 } = require("web3");

const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/f7c05a718c5e4eb6b12f251b0f5f480b",
    ),
);

const contractABI = JSON.parse(fs.readFileSync("./web3/ABI.json"));
const contractAddress = "0xf5e6ec4f23b9318ab52ab86b35a65eb8c556c193";

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getTokenURI(tokenId) {
    const uri = await contract.methods.tokenURI(tokenId).call();
    return uri;
}

async function getOwner(tokenId) {
    const owner = await contract.methods.ownerOf(tokenId).call();
    return owner;
}

module.exports = {
    getTokenURI,
    getOwner
}