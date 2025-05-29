import { scryptSync,randomBytes } from "crypto";

function encrypt_password(password:string,salt:string){
    return scryptSync(password,salt,32).toString('hex');
}

export function hash_password(password:string){
    const salt = randomBytes(16).toString('hex');
    return encrypt_password(password,salt)+salt;
}

export function password_verify(plain_password:string,hash_password:string){
    const salt = hash_password.slice(64);
    const original_hashed_password = hash_password.slice(0,64);
    const encrypted_password = encrypt_password(plain_password,salt);
    return encrypted_password === original_hashed_password;
}