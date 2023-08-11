const { searchByTokenId, create, update } = require("./dataManager/dataManager.js")
const { getTokenURI } = require("./web3/readContract.js")
const { base64ToJSON, getColor } = require("./utils/utils.js")
const { subscribeToEvents } = require("./web3/trackERC721.js")

async function saveData(from, to, tokenId, transaction) {
    try {
        const data = searchByTokenId(tokenId)
        if (data == undefined || data.transaction != transaction) {
            if (data == undefined) {
                create(tokenId, "D6D1D8", to, transaction)
                console.log(`Mint: From: ${from}, To: ${to}, TokenId: ${tokenId}`)
            } else {
                update(tokenId, data.color, to, transaction)
                console.log(`Transfer: From: ${from}, To: ${to}, TokenId: ${tokenId}`)
            }
            const uri = await getTokenURI(tokenId);
            const color = getColor(base64ToJSON(uri));
            update(tokenId, color, to, transaction);
            global.io.emit("update", {id: tokenId, color: color});
        } else {
            console.log(`Transaction control (${transaction})`);
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

async function updateData(from, to) {
    try {
        for (let i = from; i < to; i++) {
            const data = searchByTokenId(i)
            const uri = await getTokenURI(tokenId);
            const color = getColor(base64ToJSON(uri));
            if (data == undefined) {
                create(tokenId, color, to, transaction)
            } else {
                update(tokenId, color, to, transaction)
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

async function updateDataInBatch(from, to) {
    try {
        const batchSize = 50;
        const delayBetweenBatches = 1000;

        for (let i = from; i < to; i += batchSize) {
            const endIndex = Math.min(i + batchSize, to);

            updateData(i, endIndex)

            if (endIndex !== to) {
                await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

function init() {
    subscribeToEvents(saveData);
}

module.exports = {
    init,
    updateData,
    updateDataInBatch
}