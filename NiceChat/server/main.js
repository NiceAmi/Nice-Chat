const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MessageRouter = require('./Routers/massegesRouter');
const authRouter = require('./Routers/authRouter');
const usersRouter = require('./Routers/usersRouter');
const connectToDB = require('./Config/connect');
const http = require('http');
const mongoDBSession = require('connect-mongodb-session')(session);
const { createSocket } = require('./socket/appSocket');
require('dotenv').config();

connectToDB();

const store = new mongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: "session",
});

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
}));

app.use((req, res, next) => {
    const { userName, sender_id, receiver_id, time, message } = req.body;
    if (userName) {
        req.session.userName = userName;
    }
    if (sender_id) {
        req.session.sender_id = sender_id;
    }
    if (receiver_id) {
        req.session.receiver_id = receiver_id;
    }
    if (time) {
        req.session.time = time;
    }
    if (message) {
        req.session.message = message;
    }
    next();
});

const server = http.createServer(app);

app.use('/logout', function (req, res) {
    req.session.destroy();
    res.send('logout successfully');
});
app.use('/api/messages', MessageRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

createSocket(server);
