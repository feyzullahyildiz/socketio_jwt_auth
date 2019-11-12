import io from 'socket.io-client'

const client = io('http://localhost:3000', {
    transportOptions: {
        polling: {
            extraHeaders: {}
        }
    }
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
client.on('no_auth', (data) => { 
    const container = document.querySelector('.response-data-container')
    const div = document.createElement('div')
    div.innerHTML = `NO AUTH`;
    container.appendChild(div)
})
client.on('getDataResponse', (data) => {
    const container = document.querySelector('.response-data-container')
    const div = document.createElement('div')
    div.innerHTML = `${data.number} __ ${data.date}`;
    container.appendChild(div)
})
client.on('connect', () => {
    client.on('authenticated', (data) => {
        if (data && data.token) {
            client.io.opts.transportOptions.polling.extraHeaders.Authorization = 'Bearer ' + data.token
            client.disconnect();
            client.connect();
        }
    })

})