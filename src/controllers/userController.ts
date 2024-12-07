import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

// Get all Users
export const getAllUsers = async (_req: Request, res: Response ) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get a single User
export const getUserById = async (_req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: _req.params.userId })
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Create a new User
export const createUser = async (req: Request, res: Response ) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Update a User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with this ID!'});
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Delete a User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
    
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '});
        }

        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and associated thoughts deleted!' })
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Add a Friend
export const addFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with this ID!' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Get all Friends of User
export const getFriends = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        
        const friendList = user.friends;

        res.json(friendList);
        return;

    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// Delete a Friend
export const deleteFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID!' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}