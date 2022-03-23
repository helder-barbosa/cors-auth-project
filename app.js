require('dotenv').config();
require('./config/database').connect();
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./model/user');
const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(email && password && firstName && lastName)) {
      res.status(400).send('All input is required');
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    encryptedUserPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      password: encryptedUserPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '5h',
      }
    );
    user.token = token;

    res.status(201).json(user);
    console.log('[REGISTER] User Added !');
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send('All input is required !');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '5h',
        }
      );

      user.token = token;
      console.log('[LOGIN] Login Aprovado !');
      return res.status(200).json(user);
    }
  } catch {
    return res.status(400).send('Invalid Credentials !');
  }
});

module.exports = app;
