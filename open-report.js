const { exec } = require('child_process');
const path = require('path');

const reportPath = path.join(__dirname, 'mochawesome-report', 'mochawesome.html');

let command;
switch (process.platform) {
    case 'darwin':
        command = 'open';
        break;
    case 'win32':
        command = 'start';
        break;
    default:
        command = 'xdg-open';
}

exec(`${command} ${reportPath}`);