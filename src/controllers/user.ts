import express from 'express'

import { deleteUserById, getUsers, getUserById } from '../db/users'

export const getAllUsers = async (req: express.Request, res: express.Response) => {

    try {
        const user = await getUsers();

        return res.status(200).send(user);
    } catch (e) {

        console.log(e);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {

    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deleteUserById);
    } catch (e) {

        console.log(e);
        return res.status(400).send("error happenes when deleting the account")
    }
}

export const updateUsername = async (req: express.Request, res: express.Response) => {
    
    try{
    const { id } = req.params;
    const { username } = req.body;

    if (!username) return res.status(400).send("request body doesn't have username.")

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
    }catch(e){
        console.log(e);
        return res.status(400).send('error happens while updating the username')
    }

}