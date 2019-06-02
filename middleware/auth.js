import {privKey} from '../utils/jwt-util'
import logger from '../utils/logger'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import response from '../utils/response'

const verifyJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        logger.info(`JWT:: ${token}`);
        let jwtPayload = jwt.verify(token, privKey);
        User.findById(jwtPayload.id)
            .select('_id username updatedAt')
            .exec()
            .then(user => {
                req.user = user;
                next()
            })
            .catch(err => {
                logger.error(err);
                return response.sendError(res, err);
            })
    } catch (err) {
        logger.error(err);
        return response.sendError(res, err);
    }
};

export default verifyJWT