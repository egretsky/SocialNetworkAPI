import mongoose, { Schema } from 'mongoose';
const reactionSchema = new Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
    _id: false
});
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true
});
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
    return this.reactions.length;
});
export const Thought = mongoose.model('Thought', thoughtSchema);
export const Reaction = mongoose.model('Reaction', reactionSchema);
