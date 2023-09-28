//dialogs

const dialogColor = {
    red: '#e84117cc',
    blue: '#0097e6cc',
    green: '#44bd32cc'
}

const dialogIcon = {
    alert: '⚠️',
    check: '✔️',
    light: '⚡',
    bell: '🔔',
    shuffle: '🔀',
    party: '🎉'
}

function showAndHideDialog(message, color, icon, time) {
    document.getElementById('dialogIcon').innerHTML = icon
    document.getElementById('dialogTitle').innerHTML = message;
    document.getElementById('dialog').style.backgroundColor = color;
    document.getElementById('dialog').style.opacity = '100';
    setTimeout(() => {
        document.getElementById('dialog').style.opacity = '0';
    }, time);
}

function hideDialog() {
    document.getElementById('dialog').style.opacity = '0';
}

function showDialog(message, color, icon) {
    document.getElementById('dialogIcon').innerHTML = icon
    document.getElementById('dialogTitle').innerHTML = message;
    document.getElementById('dialog').style.backgroundColor = color;
    document.getElementById('dialog').style.opacity = '100';
}

export {
    dialogColor,
    dialogIcon,
    showDialog,
    hideDialog,
    showAndHideDialog
}