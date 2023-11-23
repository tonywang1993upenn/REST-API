import express from "express"

import { get, merge } from 'lodash'
import { getUserBySessionToken } from "../db/users"

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {


    try {
        //check the cookie header
        const sessionToken = req.cookies['My_AUTH'];

        if (!sessionToken) {
            return res.status(403).send("Please log in.");
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(403).send("User are not exist.");

        }

        //add the identity header req
        merge(req, { identity: existingUser });

        return next();

    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const { id } = req.params;
        //identity header is know type we need to declare the type 
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.status(403).send("Userid not exist.")
        }
        if(currentUserId.toString() !== id){
            return res.status(403).send("Provide id doesn't match to the record");
        }

        next();
    }catch(e){

        console.log();
        return res.status(400).send("error happend when checking isOwner ")  
        }
   

}
