import { web3modal, WagmiCore, mint } from "./contract.js";
import { dialogColor, dialogIcon, showDialog, hideDialog, showAndHideDialog } from './miscellaneous.js';

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
        mint(id);
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
    squareWidth = (squareWidth *  Math.round(columns)) / columns;

    let gap = squareWidth * gapRatio;
    let size = squareWidth - gap;

    grid.style.gridTemplateColumns = `repeat(auto-fill, ${size}px)`;
    //grid.style.gridAutoRows = `${size}px`;
    grid.style.gap = `${gap}px`;
    //grid.style.height = `${windowHeight}px`;
}

window.addEventListener('resize', updateElementSize);

web3modal.subscribeModal(newState => {
    const account = WagmiCore.getAccount();
    if (account.address) {
        showAndHideDialog('Wallet connected!', dialogColor.green, dialogIcon.party, 2000);
    } else {
        showDialog('Click on square to connect your wallet!', dialogColor.blue, dialogIcon.bell)
    }
})

document.addEventListener("DOMContentLoaded", async function () {
    initGrid();
    const account = WagmiCore.getAccount();
    if (account.address) {
        showAndHideDialog('Wallet connected!', dialogColor.green, dialogIcon.party, 2000);
    } else {
        web3modal.openModal();
        button.style.backgroundColor = "#1ABC9C";
    }
});