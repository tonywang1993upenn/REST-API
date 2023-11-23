import { getUserByEmial, createUser } from "../db/users";
import express from "express";
import { authentication, random } from "../helper";


/**
 * Checking the req.body and output the user informatio.
 * @param req requst from the client 
 * @param res response to the client 
 * @returns Success:return user tuple. Fail: return 400 status code 
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
     
        const { email, password } = req.body;

        if (!email || !password) {
            res.sendStatus(400).send("missing email and password inputs");
        }
        //add + sign likes the "1" in mongdb query. It means show this attribute in the result.
        const user = await getUserByEmial(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.status(400).send("Account is not registered")
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        //generate a session token based on the user._id. 
        //save the sessionToken and store in cookie
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        //no interruption 
        await user.save();

        res.cookie('My_AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user).end();

    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
   console.log("hi register")
    try {
        const { email, password, username } = req.body;
        console.log (req.body)
        console.log("e"+ email+ "p" + password + "u"+ username );
        //check when at least one of them undefined 
        if (!email || !password || !username) {

            return res.status(400).send("missing Inputs");
        }

        const existingUser = await getUserByEmial(email);
        
        if (existingUser) {

            return res.status(400).send("Existing user");
        }

        //creating a password 
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }

        });
        return res.status(200).json(user).end();

    } catch (e) {

        console.log(e);
        return res.sendStatus(400).send("erro occurs");
    }


}