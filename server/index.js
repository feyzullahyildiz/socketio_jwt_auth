const jwt = require('jsonwebtoken')
const app = require('http').createServer();
const SECRET_KEY = 'SECRET_KEY__SECRET_KEY'

const io = require('socket.io')(app, {
    handlePreflightRequest: function (req, res) {
        const headers = {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': 'http://localhost:1234',
            'Access-Control-Allow-Credentials': true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

const validateToken = (token) => {
    const obj = jwt.verify(token, SECRET_KEY)
    return obj;
}
const getValidToken = (username) => {
    return jwt.sign({ username }, SECRET_KEY)
}
io.on('connect', (socket) => {
    console.log('connect')
    socket.use((obj, next) => {
        const [key, value] = obj;
        if (key === 'authenticate') {
            return next()
        }
        const authorization = socket.request.headers['authorization'];
        if (authorization) {
            const [_, token] = authorization.split(' ')
            try {
                validateToken(token)
                next();
                return;
                
            } catch (error) {
                console.log('JWT token not valid')
            }
        }
        console.log('Not Authenticated')
        socket.emit('no_auth')
    });
    socket.on('disconnect', (socket) => {
        console.log('disconnect')
    })
    socket.on('authenticate', (data) => {
        if (data && data.username && data.password) {
            if (data.username === 'admin' && data.password === '12345') {
                const token = getValidToken(data.username)
                socket.emit('authenticated', { token })
            }
        }
    })
    socket.on('getData', () => {
        socket.emit('getDataResponse', { number: Math.random() * 1000, date: new Date()})
    })
})
app.listen(3000, () => {
    console.log('Server Started')
})