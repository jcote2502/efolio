
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../schema/Users');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


module.exports = {
    generateToken: (user) => {
        const payload = {
            _id: user._id,
            email: user.email
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    },

    hashPassword: (password) => {
        return bcrypt.hashSync(password, 10);
    },


    ensureAuthenticated: (req, res, next) => {
        const token = req.header('Authorization');

        if (!token) return res.status(400).send('Access Denied');
        try {
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            return res.status(400).send('Invalid Token');
        }
    },

    sendTokenResponse: async (user, res) => {
        try {
            const token = module.exports.generateToken(user);
            user.authToken = token;
            await user.save();
            user.password='';
            user.siteToken='';
            return res.status(200).json({user, token})
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    retrieveUser: async (email) => {
        try {
            const user = await User.findOne({email});
            if (!user) return null;
            return user;
        } catch (error) {
            return null;
        }
    },

    passwordCompare: async (password, encryptedPassword) => {
        try{
            const validPassword = await bcrypt.compare(password, encryptedPassword);
            if (!validPassword) return false
            return true
        }catch (error){
            return false
        }
    }
}


