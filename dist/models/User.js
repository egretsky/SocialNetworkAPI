import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address format',
        },
    },
    thoughts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'thought',
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    ],
}, {
    toJSON: {
        getters: true,
    },
    id: false,
});
userSchema
    .virtual('friendCount')
    .get(function () {
    return this.friends.length;
});
const User = mongoose.model('User', userSchema);
export default User;
