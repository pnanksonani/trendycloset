const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');               // <-- require returns a ROUTER function
const { errorHandler } = require('./middlewares/errorHandler'); // <-- destructure the function

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);                          // <-- pass the router (a function), NOT an object

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/products', require('./routes/products'));
app.use('/api/user', require('./routes/user'));
app.use('/api/partner', require('./routes/partner'));
app.use('/api/notifications', require('./routes/notifications'));

app.use(errorHandler);                                     // <-- pass the function, NOT the module

module.exports = app;
