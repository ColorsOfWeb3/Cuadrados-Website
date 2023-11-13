import { connect, subscribe, account } from "./contract.js";

const cuadrado = document.getElementById('cuadrado');
const connectButton = document.getElementById("connect");
const user = account();

var titles = document.getElementsByClassName('title');
var titleArray = [];
var currentTitle = 0;

titles[currentTitle].style.opacity = 1;
for (var i = 0; i < titles.length; i++) {
    splitTitle(titles[i]);
}

document.getElementById("connect").addEventListener("click", async () => {
    connect();
});

if (user.address) {
    connectButton.innerHTML = "Connected <div style='background: #4cd137;'></div>"
    connected(user.address);
}

subscribe(() => {
    let user = account();
    if (user.address) {
        if (currentTitle != 1) {
            connectButton.innerHTML = "Connected <div style='background: #4cd137;'></div>"
            connected(user.address);
        }
    } else {
        if (currentTitle != 0) {
            connectButton.innerHTML = "Connect <div style='background: #e84118;'></div>"
            disconnected();
        }
    }
})

function connected(address){
    const code = address.substring(2, 14).toUpperCase().split("");
    const colorCode = '#' + code[1] + code[3] + code[5] + code[7] + code[9] + code[11];
    updateTitle(1, colorCode);

    cuadrado.classList.toggle('hidden');
    setTimeout(() => {
        cuadrado.style.background = colorCode;
        cuadrado.classList.toggle('hidden');
        changeToTitle(1);
    }, 800);
}

function disconnected(){
    cuadrado.classList.toggle('hidden');
    setTimeout(() => {
        cuadrado.style.background = "";
        cuadrado.classList.toggle('hidden');
        changeToTitle(0);
    }, 800);
}

function updateTitle(position, newTitle) {
    let word = titles[position];
    var content = newTitle;
    word.innerHTML = '';
    var letters = [];
    for (var i = 0; i < content.length; i++) {
        var letter = document.createElement('span');
        letter.className = 'letter out';
        letter.innerHTML = content.charAt(i);
        word.appendChild(letter);
        letters.push(letter);
    }

    titleArray[position] = letters;
}

function changeToTitle(position) {
    var cw = titleArray[currentTitle];
    var nw = titleArray[position];

    if (currentTitle == position) {
        for (var i = 0; i < cw.length; i++) {
            animateLetterOut(cw, i);
            animateLetterIn(cw, i);
        }
    } else {
        for (var i = 0; i < cw.length; i++) {
            animateLetterOut(cw, i);
        }

        for (var i = 0; i < nw.length; i++) {
            nw[i].className = 'letter behind';
            nw[0].parentElement.style.opacity = 1;
            animateLetterIn(nw, i);
        }
    }

    currentTitle = position;
}

function animateLetterOut(cw, i) {
    setTimeout(function () {
        cw[i].className = 'letter out';
    }, i * 80);
}

function animateLetterIn(nw, i) {
    setTimeout(function () {
        nw[i].className = 'letter in';
    }, 340 + (i * 80));
}

function splitTitle(word) {
    var content = word.innerHTML;
    word.innerHTML = '';
    var letters = [];
    for (var i = 0; i < content.length; i++) {
        var letter = document.createElement('span');
        letter.className = 'letter';
        letter.innerHTML = content.charAt(i);
        word.appendChild(letter);
        letters.push(letter);
    }

    titleArray.push(letters);
}

document.getElementById("container").style.opacity = 100;
document.getElementById("container").style.visibility = 'visible';