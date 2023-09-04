import { web3modal, WagmiCore, mint } from "./contract.js";

const socket = io();
let data = {};

const supply = 1225; //35 x 35
const dafaultColor = "95A5A6";

function initSVG(totalItems) {
    const gridDiv = document.querySelector(".grid");
    const delay = 1000 / totalItems;
    for (let i = 0; i < totalItems; i++) {
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

document.addEventListener("DOMContentLoaded", async function () {
    data = await getData();
    updateElementSize();
    initSVG(supply);
    const account = WagmiCore.getAccount();
    const button = document.getElementById('connect');
    if (account.address) {
        button.innerHTML = "Connected";
        button.style.backgroundColor = "#3498DB";
    } else {
        web3modal.openModal();
        button.style.backgroundColor = "#1ABC9C";
    }
});

document.getElementById('connect').addEventListener('click', () => {
    web3modal.openModal()
})

web3modal.subscribeModal(newState => {
    const account = WagmiCore.getAccount();
    const button = document.getElementById('connect');
    if (account.address) {
        button.innerHTML = "Connected";
        button.style.backgroundColor = "#3498DB";
    } else {
        button.innerHTML = "Connect";
        button.style.backgroundColor = "#1ABC9C";
    }
})

function updateElementSize() {
    const gapRatio = 0.2;
    const widthPnM = 20;
    const heightPnM = 20;
    const heightRatio = 0.94;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight * heightRatio;

    const vw = (windowWidth - widthPnM) * (1 - gapRatio);
    const vh = (windowHeight - heightPnM) * (1 - gapRatio);


    let area = vw * vh;
    let squareArea = area / supply;
    let width = Math.sqrt(squareArea);

    let nw = vw / width;
    let nh = vh / width;

    const gapW = (windowWidth * gapRatio) / nw;
    const gapH = (windowHeight * gapRatio) / nh;

    const gap = Math.min(gapW, gapH)

    const result = width - ((width + gap) / Math.max(nw, nh));

    const element = document.getElementById('grid');
    element.style.gridTemplateColumns = `repeat(auto-fit, ${result}px)`;
    element.style.gridAutoRows = `${result}px`;
    element.style.gap = `${gap}px`
}

window.addEventListener('resize', updateElementSize);