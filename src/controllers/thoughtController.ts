import { Request, Response } from 'express';
import { Thought, User, Reaction } from '../models/index.js';
// import mongoose from 'mongoose';

// Get all Thoughts
export const getAllThoughts = async (_req: Request, res: Response ) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get a single Thought
export const getThoughtById = async (_req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({_id: _req.params.thoughtId })
            .select('-__v');

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }

        res.json(thought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Create a new Thought
export const createThought = async (req: Request, res: Response ) => {
    try {
        const { thoughtText, username, userId } = req.body;
        const thought = await Thought.create({ thoughtText, username });
        await User.findByIdAndUpdate(userId, {$push:{thoughts: thought._id}}, {new: true});
        res.json('Thought created!')
        return;
    } catch (err) {
        res.status(500).json(err);
    }
    return;
}

// Update a Thought
export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID!'});
        }

        res.json(thought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Delete a Thought
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });
    
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID '});
        }
        
        const { username } = thought;
        await User.findOneAndUpdate({ username }, {$pull:{thoughts: thought._id}}, {new: true});
        await Reaction.deleteMany({ _id: { $in: thought.reactions } });
        res.json({ message: 'Thoughts and associated reactions deleted!' });
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Add a Reaction
export const addReaction = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;
    
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId, { $push: {reactions: {reactionBody, username}}},
            { runValidators: true, new: true }
        );

        if (!updatedThought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }

        res.json(updatedThought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Delete a Reaction
export const deleteReaction = async (req: Request, res: Response) => {
    const { thoughtId, reactionId } = req.params;
    
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId, { $pull: {reactions: { reactionId }}},
            { new: true }
        );
        console.log(updatedThought);
        if (!updatedThought) {
            return res.status(404).json({ message: 'No thought with this ID!' });
        }

        res.json(updatedThought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}