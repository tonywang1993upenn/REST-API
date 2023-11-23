import mongoose from "mongoose";


//select means the data will not show if query by default
/**
 * Creating a mongoose Schema 
 required fields: username, email
 select fields(Not show unless specifiy): 
 password, s
 salt(addtional infor added to concatenate with the passowrd)
 sessionToken: for cookie 
 */
const UserSchema = new mongoose.Schema({

    username: {type:String, required: true},
    email:{ type: String, required: true},
    authentication:{
            //
        password :{ type: String, required: true, select: false},
        salt:{type: String, select:false},
        sessionToken:{type: String, select: false}
    },

});

export const UserModel = mongoose.model('User', UserSchema);

//action query 
export const getUsers = () => UserModel.find();
export const getUserByEmial = (email:string) => UserModel.findOne({email})
export const getUserBySessionToken = (sessionToken:string)=>UserModel.findOne({

    'authentication.sessionToken': sessionToken,
})

export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values:Record<string, any>)=> new UserModel(values).save()
.then((user)=> user.toObject());

export const deleteUserById = (id:string) => UserModel.findByIdAndDelete({_id:id});
export const updateUserById =
 (id:string, values:Record<string,any>)=>
  UserModel.findByIdAndUpdate(id, values)
  