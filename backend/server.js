const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./database');
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());
app.use(cors());

sequelize.sync();
// Symmetric encryption key 
const encryptionKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

app.post('/register', async(req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username: encrypt(username) } });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    await User.create({ username: encrypt(username), password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: encrypt(username) } });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(5000, async() => {
    await sequelize.authenticate();
    console.log('Database connected and server running on port 5000');
});