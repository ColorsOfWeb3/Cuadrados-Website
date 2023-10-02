import { connect, changeNetwork, subscribe, account, mint } from "./contract.js";
import { dialogColor, dialogIcon, showDialog, hideDialog } from './miscellaneous.js';

const socket = io();
let data = {};

const supply = 1225; //35 x 35
const dafaultColor = "dcdde1";

async function initGrid() {
    updateElementSize();
    data = await getData();
    const gridDiv = document.querySelector(".grid");
    const delay = 0 / supply;
    for (let i = 0; i < supply; i++) {
        setTimeout(() => {
            const svgImage = createSVG(i);
            gridDiv.appendChild(svgImage);
        }, i * delay);
    }
}

function createSVG(id) {
    const data = getElementData(id);

    let color = data ? data.color : dafaultColor;

    const container = document.createElement("div");
    container.classList = "cuadrado"
    container.setAttribute("id", id);
    container.style.background = `#${color}`

    const tooltip = document.createElement("div");
    tooltip.classList = "tooltip";
    tooltip.textContent = color == dafaultColor ? "mint" : color;

    container.appendChild(tooltip);

    container.addEventListener("click", async function () {
        const id = this.getAttribute("id");
        const response = await mint(id);
        if (response.status == 'OK') {
            showDialog(`Minting Cuadrado #${id}...`, dialogColor.blue, dialogIcon.alert, {
                duration: 6000,
                link: {
                    url: "https://mumbai.polygonscan.com/tx/" + response.value,
                    title: "Transaction details"
                }
            })
        } else {
            manageError(response.value, {tokenId: id})
        }
    });

    return container;
}

function updateSVG(data) {
    const cuadrado = document.getElementById(data.id);
    cuadrado.style.background = `#${data.color}`
    cuadrado.querySelector("div").textContent = data.color;
}

async function getData() {
    const data = await fetch("/data")
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    return data;
}

function getElementData(id) {
    const result = data.find(data => data.tokenId == id);
    return result;
}

socket.on('update', data => {
    updateSVG(data);
});

function updateElementSize() {
    const gapRatio = 0.16;
    const grid = document.querySelector('.grid');

    const windowWidth = grid.clientWidth;
    const windowHeight = grid.clientHeight;

    let area = windowWidth * windowHeight;
    let squareArea = area / supply;
    let squareWidth = Math.sqrt(squareArea);

    let columns = windowWidth / squareWidth;
    squareWidth = squareWidth *  (2 - Math.round(columns) / columns);

    let gap = squareWidth * gapRatio;
    let size = squareWidth - gap;

    grid.style.gridTemplateColumns = `repeat(${Math.round(columns)}, ${size}px)`;
    grid.style.gap = `${gap}px`;
}

window.addEventListener('resize', updateElementSize);

document.addEventListener("DOMContentLoaded", async function () {
    initGrid();
    const user = account();
    if (user.address) {
        showDialog('Wallet connected!', dialogColor.green, dialogIcon.party, {
            duration: 4000,
            onclick: {
                function: connect,
                title: 'Manage wallet'
            }
        });
    } else {
        connect();
    }
    subscribe(() => {
        const user = account();
        if (user.address) {
            showDialog('Wallet connected!', dialogColor.green, dialogIcon.party, {
                duration: 4000,
                onclick: {
                    function: connect,
                    title: 'Manage wallet'
                }
            });
        } else {
            showDialog('Click on square to connect your wallet!', dialogColor.blue, dialogIcon.bell, {
                link: {
                    url: 'https://metamask.io/',
                    title: 'Get Metamask here'
                }
            })
        }
    })
});

document.getElementById('dialogClose').addEventListener("click", async function () {
    hideDialog();
});

async function manageError(error, options) {
    const message = error.message.replace(/(\r\n|\r|\n)/g, '<br>');
    switch (error.name) {
        case 'ConnectorNotFoundError':
            connect();
            break;
        case "ChainMismatchError":
            try {
                await changeNetwork();
                mint(options.tokenId);
            } catch (error) {
                showDialog('Switch to Polygon Mumbai', dialogColor.red, dialogIcon.shuffle, {
                    duration: 4000
                })
            }
            break;
        case 'TransactionExecutionError':
            showDialog("Transaction error", dialogColor.red, dialogIcon.alert, {
                duration: 4000,
                link: {
                    url:'./log.html?message=' + message,
                    title: 'See details'
                }
            })
            break;
        case "ContractFunctionExecutionError":
            showDialog('Execution error', dialogColor.red, dialogIcon.alert, {
                duration: 4000,
                link: {
                    url:'./log.html?message=' + message,
                    title: 'See details'
                }
            })
            break;
        default:
            console.error('Error:', message);
            showDialog('Unaddressed error', dialogColor.red, dialogIcon.alert, {
                duration: 4000,
                link: {
                    url:'./log.html?message=' + message,
                    title: 'See details'
                }
            })
    }
}
