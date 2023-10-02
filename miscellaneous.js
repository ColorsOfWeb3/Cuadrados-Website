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
    }
    if (options.onclick !== undefined) {
        document.getElementById('dialogLink').addEventListener('click', () => {
            options.onclick.function();
        })
        document.getElementById('dialogLink').innerHTML = options.onclick.title;
    }
    document.getElementById('dialog').style.backgroundColor = color;
    document.getElementById('dialog').style.opacity = '100';
    document.getElementById('dialog').style.visibility = 'visible';
    if (options.duration !== undefined) {
        setTimeout(() => {
            document.getElementById('dialog').style.opacity = '0';
            document.getElementById('dialog').style.visibility = 'hidden';
            document.getElementById('dialogLink').innerHTML = '';
        }, options.duration);
    }
}

function hideDialog() {
    document.getElementById('dialog').style.opacity = '0';
    document.getElementById('dialog').style.visibility = 'hidden';
    document.getElementById('dialogLink').innerHTML = '';
}

export {
    dialogColor,
    dialogIcon,
    showDialog,
    hideDialog
}