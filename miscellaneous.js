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

var timeout;

function showDialog(message, color, icon, options) {
    options = options || {};

    clearTimeout(timeout);
    document.getElementById('dialogIcon').innerHTML = icon
    document.getElementById('dialogTitle').innerHTML = message;
    if (options.link !== undefined) {
        document.getElementById('dialogLink').setAttribute('href', options.link.url);
        document.getElementById('dialogLink').innerHTML = options.link.title;
    } else {
        document.getElementById('dialogLink').setAttribute('href', '#');
    }
    if (options.onclick !== undefined) {
        document.getElementById('dialogLink').addEventListener('click', () => {
            options.onclick.function();
            return false;
        })
        document.getElementById('dialogLink').innerHTML = options.onclick.title;
    } else {
        let element = document.getElementById('dialogLink')
        element.parentNode.replaceChild(element.cloneNode(true), element)
    }
    if (!options.onclick && !options.link) {
        document.getElementById('dialogLink').innerHTML = '';
    }
    document.getElementById('dialog').style.backgroundColor = color;
    document.getElementById('dialog').style.opacity = '100';
    document.getElementById('dialog').style.visibility = 'visible';
    if (options.duration !== undefined) {
        timeout = setTimeout(() => {
            document.getElementById('dialog').style.opacity = '0';
            document.getElementById('dialog').style.visibility = 'hidden';
        }, options.duration);
    }
}

function hideDialog() {
    clearTimeout(timeout);
    document.getElementById('dialog').style.opacity = '0';
    document.getElementById('dialog').style.visibility = 'hidden';
}

export {
    dialogColor,
    dialogIcon,
    showDialog,
    hideDialog
}