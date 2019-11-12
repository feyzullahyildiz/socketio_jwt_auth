import io from 'socket.io-client'

const client = io('http://localhost:3000', {
    transportOptions: {
        polling: {
            extraHeaders: {}
        }
    }
})
const addRow = (text) => {
    const container = document.querySelector('.response-data-container')
    const div = document.createElement('div')
    div.innerHTML = text;
    container.appendChild(div)
}
client.on('no_auth', (data) => {
    addRow(`NO AUTH`)
})
client.on('getDataResponse', (data) => {
    addRow(`${data.number} __ ${data.date}`)
})
client.on('authenticated', (data) => {
    if (data && data.token) {
        client.io.opts.transportOptions.polling.extraHeaders.Authorization = 'Bearer ' + data.token
        client.disconnect();
        client.connect();
    }
})
client.on('connect', () => {
    console.log('client connected to the server');
})
window.client = client;

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    client.emit('authenticate', {
        username,
        password
    })
})

const getDataButton = document.querySelector('.test');
getDataButton.addEventListener('click', () => {
    client.emit('getData')
})
