// execute this file to start all the servers

const { spawn } = require('child_process');
const path = require('path');

async function frontend() {
    const frontend = spawn('npm', ['start'], { cwd: path.join(__dirname, 'frontend'), shell: true });

    frontend.stdout.on('data', (data) => {
        console.log(`frontend: ${data}`);
    });

    frontend.stderr.on('data', (data) => {
        console.error(`frontend: ${data}`);
    });

    frontend.on('close', (code) => {
        console.log(`frontend exited with code ${code}`);
    });
}

async function backend() {
    const backend = spawn('npm', ['run','dev'], { cwd: path.join(__dirname, 'backend/main'), shell: true});

    backend.stdout.on('data', (data) => {
        console.log(`backend: ${data}`);
    });

    backend.stderr.on('data', (data) => {
        console.error(`backend: ${data}`);
    });

    backend.on('close', (code) => {
        console.log(`backend exited with code ${code}`);
    });
}

async function ws() {
    const ws = spawn('nodemon', ['index.js'], { cwd: path.join(__dirname, 'backend/ws') , shell: true});

    ws.stdout.on('data', (data) => {
        console.log(`ws: ${data}`);
    });

    ws.stderr.on('data', (data) => {
        console.error(`ws: ${data}`);
    });

    ws.on('close', (code) => {
        console.log(`ws exited with code ${code}`);
    });
}

frontend();
backend();
ws();

