const fs = require("fs");
const { Web3 } = require("web3");

const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://polygon-mumbai.infura.io/v3/f7c05a718c5e4eb6b12f251b0f5f480b",
    ),
);

const contractABI = JSON.parse(fs.readFileSync("./web3/ABI.json"));
const contractAddress = "0x2ba9ad99995484cf9ad205f37d4bd679a4a67281";

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getTokenURI(tokenId) {
    const uri = await contract.methods.tokenURI(tokenId).call();
    return uri;
}

module.exports = {
    getTokenURI
}