import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 10;

const userSchema = new mongoose.Schema({
   username: {
       type: String,
       required: true,
       unique: true,
       index: true
   },
    password: {
        type: String,
        unique: true
    },
    follows: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            unique: true
        }
    ]
});

userSchema.pre('save', function (next) {
    if(!this.password) {
        next();
    } else {
        bcrypt.hash(this.password, saltRounds).then( (hash) => {
            this.password = hash;
            next();
        });
    }
});

userSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('Users', userSchema);