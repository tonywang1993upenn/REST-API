import cycpto from 'crypto'

//create secret key to encrypt
const SECRET = "My_Encypt"
export const random = () => cycpto.randomBytes(128).toString('base64')

//the key for this hash join with salt 
//digest reutn the format we want to return 
export const authentication = (salt: string, password: string) =>{

    return cycpto.createHmac("sha256", [salt, password].join("/")).update(SECRET).digest("hex");

}