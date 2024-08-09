require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const MessageRouter = require('./Routers/massegesRouter');
const authRouter = require('./Routers/authRouter');
const usersRouter = require('./Routers/usersRouter');
const connectToDB = require('./Config/connect');
const http = require('http');
const mongoDBSession = require('connect-mongodb-session')(session);
const { createSocket } = require('./socket/appSocket');

const app = express();
const server = http.createServer(app);

// Connect to database
connectToDB();

// Session store
const store = new mongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: "session",
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production'
    },
    store: store,
}));

// Session middleware
app.use((req, res, next) => {
    const { userName, sender_id, receiver_id, time, message } = req.body;
    if (userName) req.session.userName = userName;
    if (sender_id) req.session.sender_id = sender_id;
    if (receiver_id) req.session.receiver_id = receiver_id;
    if (time) req.session.time = time;
    if (message) req.session.message = message;
    next();
});

// Routes
app.use('/api/messages', MessageRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use('/logout', function (req, res) {
    req.session.destroy();
    res.send('logout successfully');
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start server
const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
});

createSocket(server);
