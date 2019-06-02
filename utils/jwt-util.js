import config from 'config'
import fs from "fs";

const RSAKeys = {
    privKey: fs.readFileSync(config.get('privateKey'), 'utf-8'),
    pubKey: fs.readFileSync(config.get('publicKey'), 'utf-8'),
};

module.exports = RSAKeys;
