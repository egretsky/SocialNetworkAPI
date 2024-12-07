import mongoose, { Schema, type Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    thoughts: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
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
},
{
    toJSON: {
        getters: true,
    },
    id: false,
}
);

userSchema
    .virtual('friendCount')
    .get(function (this: IUser) {
        return this.friends.length;
    })

    
const User = mongoose.model<IUser>('User', userSchema);

export default User;