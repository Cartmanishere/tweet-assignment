import express from 'express'
import User from '../models/user'
import response from '../utils/response'
import bcrypt from 'bcrypt'
import verifyJWT from '../middleware/auth'
import logger from '../utils/logger'
import validate from '../utils/validation'

const router = express.Router();

router.post('/register', validate.user, (req, res) => {
    User.findOne({ username: req.body.username }).then( (user) => {
        if (user) {
            return response.sendError(res, new Error("Username already exists"))
        } else {
            let newUser = new User({
                username: req.body.username,
                password: req.body.password
            })
            newUser.save().then( user => {
                response.sendMessage(res, "User with username " + user.username + " created")
            }).catch( err => {
                return response.sendError(res, err)
            })
        }
    })
});

router.get('/:userId/follow', verifyJWT, (req, res) => {
    User.findById(req.user._id).select('_id username follows').then(user => {
        if (!user) {
            return response.sendError(res, new Error("User not found"), 404);
        }
        if (user.follows.includes(req.params.userId)) {
            return response.sendError(res, new Error("User is already followed"))
        }
        User.findById(req.params.userId).then(followUser => {
            if (!followUser) {
             return response.sendError(res, new Error("User not found"))
            }
            user.follows.push(followUser._id);

            user.save().then(user => {
            return response.sendMessage(res, 'you are following user ' + followUser.username)
            }).catch(err => {
                logger.error(err);
                return response.sendError(res, err)
            })
        })
    })
});

router.get('/:userId/unfollow', verifyJWT, (req, res) => {
   User.findById(req.user._id).then(user => {
       let index;
       if ((index = user.follows.indexOf(req.params.userId)) === -1) {
           return response.sendError(res, new Error("User is already not followed"))
       }
       user.follows.splice(index, 1);
       user.save().then(user => {
           return response.sendMessage(res, "You have unfollowed user");
       }).catch(err => {
           logger.error(err);
           return response.sendError(res, err)
       })
   })
});

router.get('/', (req, res) => {
    User.find({}).select('_id username follows').then(data => {
        return response.sendData(res, '',  data)
    })
});

router.get('/me', verifyJWT, (req, res) => {
    User.findById(req.user._id).then(user => {
        return response.sendData(res, '', [user])
    })
});

router.post('/login', validate.user, (req, res) => {
    User.findOne({username: req.body.username}).then(user => {
        if (!user) {
            return response.sendError(res, new Error("Username not found"))
        }
        bcrypt.compare(req.body.password, user.password).then( isSame => {
            if (!isSame) {
                return response.sendError(res, new Error("Incorrect password"))
            }
            let payload = {
                id: user.id,
                username: user.username
            };
            return response.sendJWT(res, payload, 604800)
        })
    });
});


module.exports = router;
