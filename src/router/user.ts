import express from "express"

import { getAllUsers, deleteUser, updateUsername } from "../controllers/user"
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', isOwner, deleteUser);
    router.patch('/users/:id', isOwner, updateUsername);
}



