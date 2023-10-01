//dialogs

const dialogColor = {
    red: '#e74c3ccc',
    blue: '#487eb0cc',
    green: '#27ae60cc'
}

const dialogIcon = {
    alert: '⚠️',
    check: '✔️',
    light: '⚡',
    bell: '🔔',
    shuffle: '🔀',
    party: '🎉'
}

function showDialog(message, color, icon, options) {
    options = options || {};
    document.getElementById('dialogIcon').innerHTML = icon
    document.getElementById('dialogTitle').innerHTML = message;
    if (options.link !== undefined) {
        document.getElementById('dialogLink').setAttribute('href', options.link.url);
        document.getElementById('dialogLink').innerHTML = options.link.title;
    } else {
        document.getElementById('dialogLink').innerHTML = '';
    }
    document.getElementById('dialog').style.backgroundColor = color;
    document.getElementById('dialog').style.opacity = '100';
    if (options.duration !== undefined) {
        setTimeout(() => {
            document.getElementById('dialog').style.opacity = '0';
        }, options.duration);
    }
}

function hideDialog() {
    document.getElementById('dialog').style.opacity = '0';
}

export {
    dialogColor,
    dialogIcon,
    showDialog,
    hideDialog
}