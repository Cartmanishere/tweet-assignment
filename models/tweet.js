import mongoose from 'mongoose'

const tweetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    content: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweets'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    isRetweet: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Tweets', tweetSchema);