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

    const dialog = document.getElementById('dialog');
    const dialogIcon = document.getElementById('dialogIcon');
    const dialogTitle = document.getElementById('dialogTitle');
    const dialogLink = document.getElementById('dialogLink');

    clearTimeout(timeout);
    dialogIcon.innerHTML = icon
    dialogTitle.innerHTML = message;
    if (options.link !== undefined) {
        dialogLink.setAttribute('href', options.link.url);
        dialogLink.innerHTML = options.link.title;
    } else {
        dialogLink.setAttribute('href', '#');
    }
    if (options.onclick !== undefined) {
        let element = dialogLink;
        element.parentNode.replaceChild(element.cloneNode(true), element);
        document.getElementById('dialogLink').addEventListener('click', () => {
            options.onclick.function();
            return false;
        })
        document.getElementById('dialogLink').innerHTML = options.onclick.title;
    } else {
        let element = dialogLink;
        element.parentNode.replaceChild(element.cloneNode(true), element)
    }
    if (!options.onclick && !options.link) {
        dialogLink.innerHTML = '';
    }
    dialog.style.backgroundColor = color;
    dialog.style.opacity = '100';
    dialog.style.visibility = 'visible';
    if (options.duration !== undefined) {
        timeout = setTimeout(() => {
            dialog.style.opacity = '0';
            dialog.style.visibility = 'hidden';
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