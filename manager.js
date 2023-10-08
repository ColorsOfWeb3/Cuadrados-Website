const { searchByTokenId, create, update, remove } = require("./dataManager/dataManager.js")
const { getTokenURI, getOwner } = require("./web3/readContract.js")
const { base64ToJSON, getColor } = require("./utils/utils.js")
const { subscribeToEvents } = require("./web3/trackERC721.js")
const { newLog } = require("./dataManager/logManager.js")

async function saveData(from, to, tokenId, transaction) {
    try {
        const data = searchByTokenId(tokenId)
        if (data == undefined || data.transaction != transaction) {
            const uri = await getTokenURI(tokenId);
            const color = getColor(base64ToJSON(uri));
            if (data == undefined) {
                create(tokenId, color, to, transaction)
                newLog('TokenMint', `Token ${tokenId} minted by ${to}`);
            } else {
                update(tokenId, color, to, transaction)
                newLog('TokenTransfer', `Token ${tokenId} transfered from ${from} to ${to}`);
            }
        } else {
            newLog('TransactionControl', `Transaction control applied for ${transaction}`);
        }
    } catch (error) {
        newLog(error.name, error.message);
    }
}

async function updateData(from, to) {
    
        for (let i = from; i < to; i++) {
            try {
                const data = searchByTokenId(i);
                const uri = await getTokenURI(i);
                const owner = await getOwner(i);
                const color = getColor(base64ToJSON(uri));
                if (data == undefined) {
                    create(i, color, owner, '');
                } else {
                    update(i, color, owner, '');
                }
                console.log(`Token ${i} data updated.`);
                newLog('TokenDataUpdated', `Token ${i} data updated`);
            } catch (error) {
                remove(i);
                console.log(`Token ${i} data not found`);
                newLog('TokenDataNotFound', `Token ${i} data not found`);
            }
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
        newLog(error.name, error.message);
    }
}

function initDataManager() {
    subscribeToEvents(saveData);
}

module.exports = {
    initDataManager,
    updateData,
    updateDataInBatch
}