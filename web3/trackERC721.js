const { Web3 } = require("web3");
const web3 = new Web3("wss://polygon-mumbai.infura.io/ws/v3/f7c05a718c5e4eb6b12f251b0f5f480b");

const contractAddress = "0x2ba9ad99995484cf9ad205f37d4bd679a4a67281";

let options721 = {
    topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
};

async function subscribeToEvents(callback) {
    try {
        const subscription = await web3.eth.subscribe("logs", options721);

        subscription.on("connected", (subscriptionId) => {
            console.log("Subscription on ERC-721 started with ID:", subscriptionId);
        });

        subscription.on("data", (event) => {
            if (event.address === contractAddress) {
                let transaction = web3.eth.abi.decodeLog(
                    [
                        {
                            type: "address",
                            name: "from",
                            indexed: true,
                        },
                        {
                            type: "address",
                            name: "to",
                            indexed: true,
                        },
                        {
                            type: "uint256",
                            name: "tokenId",
                            indexed: true,
                        },
                    ],
                    event.data,
                    [event.topics[1], event.topics[2], event.topics[3]],
                );

                console.log(`New ERC-721 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}`);

                callback(transaction.from, transaction.to, Number(transaction.tokenId), event.transactionHash);
            }
        });

        subscription.on("error", (error) => {
            console.error("Error occurred:", error);
        });
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

module.exports = {
    subscribeToEvents
}
