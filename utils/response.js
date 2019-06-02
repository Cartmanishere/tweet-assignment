import jwt from 'jsonwebtoken'
import fs from 'fs'
import config from 'config'
import {pubKey, privKey} from './jwt-util'

const response = {
    sendError:  (res, err, status) => {
        let returnMsg = {
            success: false,
            message: err.message,
            data: [],
            timestamp: new Date()
        };
        if (process.env.NODE_ENV === 'development' && err.stack) {
            returnMsg.message = err.stack;
        }
        return res.status( status ? status : 500 ).json(returnMsg);
    },
    sendMessage: (res, message) => {
        return res.json({
            success: true,
            message: message,
            data: [],
            timestamp: new Date()
        })
    },
    sendData: (res, message, data) => {
        return res.json({
            success: true,
            message: (message) ? message : "",
            data: data,
            timestamp: new Date()
        })
    },
};

response.sendJWT = (res, payload, expiry) => {
    jwt.sign(payload, privKey, { expiresIn: expiry }, (err, token) => {
        if (err) {
            return response.sendError(res, err)
        }
        return response.sendMessage(res, token)
    });
};

module.exports = response;