import express from 'express'
import Tweet from '../models/tweet'
import verifyJWT from '../middleware/auth'
import response from '../utils/response'
import logger from '../utils/logger'
import validate from '../utils/validation'

const router = express.Router();

router.get('/:tweetId', (req, res) => {
   Tweet.findById(req.params.tweetId).then( tweet => {
       if (!tweet) {
           return response.sendError(res, new Error("Tweet not found"), 404)
       }
       return response.sendData(res, "", [tweet])
   }).catch(err => {
       logger.error(err);
       return response.sendError(res, err)
   })
});

router.post('/new', verifyJWT, validate.tweet, (req, res) => {

   let tweet = new Tweet({
       user: req.user._id,
       content: req.body.content
   });

    tweet.save().then(tweet => {
        return response.sendData(res, "Tweet with id " + tweet._id + " created", [tweet])
    }).catch( err => {
        logger.error(err);
        return response.sendError(res, err)
    });
});

router.get('/:tweetId/like', verifyJWT, (req, res) => {
    Tweet.findById(req.params.tweetId).then(tweet => {
        if (!tweet) {
            return response.sendError(res, new Error("Tweet not found"), 404)
        }
        if (tweet.likes.includes(req.user._id)) {
            return response.sendError(res, new Error("Tweet already liked"))
        }
        tweet.likes.push(req.user._id);
        tweet.save().then(tweet => {
            return response.sendMessage(res, "Tweet liked")
        }).catch(err => {
            return response.sendError(res, err)
        })
    })
});

router.get('/:tweetId/unlike', verifyJWT, (req, res) => {
    Tweet.findById(req.params.tweetId).then(tweet => {
        if (!tweet) {
            return response.sendError(res, new Error("Tweet not found"), 404)
        }
        let index;
        if ((index = tweet.likes.indexOf(req.user._id)) === -1) {
            return response.sendError(res, new Error("Tweet not liked. So cannot unlike"))
        }
        tweet.likes.splice(index, 1);
        tweet.save().then(tweet => {
            return response.sendMessage(res, "Tweet unliked")
        }).catch(err => {
            return response.sendError(res, error)
        })
    })
});

router.get('/:tweetId/retweet', verifyJWT, (req, res) => {
    Tweet.findById(req.params.tweetId).then(tweet => {
        if (!tweet) {
            return response.sendError(res, new Error("Tweet not found"), 404)
        }
        let newTweet = new Tweet({
            user: req.user._id,
            isRetweet: true,
            parent: req.params.tweetId
        });
        newTweet.save().then(tweet => {
            return response.sendData(res, "You have retweeted", [tweet]);
        }).catch(err => {
            logger.error(err);
            return response.sendError(res, err);
        })
    })
});

router.post('/:tweetId/reply', verifyJWT, validate.tweet, (req, res) => {
    Tweet.findById(req.params.tweetId).then(tweet => {
        if (!tweet) {
            return response.sendError(res, new Error("Tweet not found"), 404)
        }

        let newTweet = new Tweet({
            user: req.user._id,
            content: req.body.content,
            parent: req.params.tweetId,
            isReply: true
        });
        newTweet.save().then(tweet => {
            return response.sendData(res, 'you have replied successfully', [tweet])
        }).catch(err => {
            logger.error(err);
            return response.sendError(res, err);
        })
    })
});

router.get('/:tweetId/replies', (req, res) => {
    Tweet.find({parent: req.params.tweetId, isReply: true}).then(tweets => {
        return response.sendData(res, '', tweets);
    }).catch(err => {
        logger.error(err);
        return response.sendError(res, err)
    })
});

router.get('/:tweetId/retweets', (req, res) => {
    Tweet.find({parent: req.params.tweetId, isRetweet: true}).then(tweets => {
        return response.sendData(res, '', tweets);
    }).catch(err => {
        logger.error(err);
        return response.sendError(res, err)
    })
});

route.get('/:tweetId/delete', verifyJWT, (req, res) => {
   Tweet.findById(req.params.tweetId).then(tweet => {
       if(!tweet) {
           return response.sendError(res, new Error("Tweet not found"), 404)
       }
       if (tweet.user !== req.user._id) {
           return response.sendError(res, new Error("You do not have permission"), 402)
       }
       Tweet.findByIdAndDelete(req.params.tweetId).then(tweet => {
           return response.sendMessage(res, "Tweet deleted")
       }).catch(err => {
           return response.sendError(res, '')
       })
   })
});

module.exports = router;
