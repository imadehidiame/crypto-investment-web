import { SignJWT, type JWTPayload } from "jose";
import { type DBSessionData } from "./lib/config/session"
import User from "./models/User.server";
import { createDbSession, destroySession, encrypt_data, getUserFromSession, sessionStore } from "./session.server";
import { ConnectToDB } from "./db.server";
import { log } from "./lib/utils";
import type { Cookie } from "react-router";


export const login = async ({username,password}:{username:string,password:string})=>{
    try {
    //log({username,password},'Login Details');
    await ConnectToDB();
    const {Sessions} = (await import('@/config.server')).default
    const JWT_SECRET = new TextEncoder().encode(Sessions.jwt_secret);
    const user = await User.findOne({$or:[{email:username}]});
    if(!user){
        //log('Invalid user not found','1');
        return {logged:false,message:'Invalid username and password combination'};
    }
    const isMatch = await user.verifyPassword(password);
    if(!isMatch){
        ///log('Incorrect password','2');
        return {logged:false,message:'Invalid username and password combination'};
    }
    const set_db_session = await createDbSession(user._id);
    //log(user,'USER DATA');
    const set_cookie_session = await ((await sessionStore(true,false,user.role === 'admin' ? Sessions.adm_name : Sessions.name)) as Cookie).serialize(await encrypt_data({token:set_db_session},JWT_SECRET,'1y'));
    //const jwt = await new SignJWT({userId:user._id.toString(),role:user.role,email:user.email,name:user.name}).setProtectedHeader({alg:'HS256'}).setExpirationTime(Sessions.//is_development ? '1y' : '1h').setIssuedAt().sign(JWT_SECRET);
    //const jwt = await create_token({userId:user._id.toString(),role:user.role,email:user.email,name:user.name});
    return {session:set_cookie_session,logged:true,role:user.role}; 
        
    } catch (error) { 
        log(error,'Error in login'); 
        throw error;
    }
    
}

export const signup = async ({username,name,password,role}:{username:string,name:string,password:string,role:string}) => {
    try {
    
    await ConnectToDB();
    const is_user = await User.findOne({email:username});
    //log(is_user,'Is user value');
    if(is_user)
        return {logged:false,message:'Unfortunately the provided email already exists'};
    
    const user = new User({
        role,
        email:username,
        password,
        name,
        //createdAt:new Date(Date.now()),
        updatedAt:new Date(Date.now())
    });
    //log(user,'User data object');
    const served = await user.save();
    //log(served,'Saved data');
    const user_data = await login({username,password});
    if(!user_data.logged)
        return {logged:false,message:'An error occured'};
    return {logged:true,session:user_data.session};
        
    } catch (error) {
        log(error,'Error in sign up');
        throw error;
    }
    
}

export const logout = async (request:Request,is_user:boolean)=>{
    //return {session:set_cookie_session,logged:true,role:user.role};
    return await destroySession(request,is_user);  
}

export const isAuthenticated = async (request:Request)=>{
    return !!(await getUserFromSession(request));
    //return !!user;
}

export const getAuthenticatedUser = async (request:Request) =>{
    return await getUserFromSession(request);
}

export const hasRequiredRole = (role?:string,requiredRole?:string) =>{
    if(!requiredRole)
        return true;
    if(!role)
        return false;
    return role === requiredRole;
}

export const getRequiredRolePath = (path:string) => {
    const adm_routes = ['/api/adm/deposit'];
    const check = adm_routes.some(e=>e===path);
    if(check)
        return 'admin';
    if(path.startsWith('/dashboard/adm'))
        return 'admin';
    if(path.startsWith('/dashboard'))
        return 'user';
    return null;
}

interface JwtData extends DBSessionData {
    userId:string
}

export const create_token = async (data:JWTPayload) =>{
    const {Sessions} = (await import('@/config.server')).default
    const JWT_SECRET = new TextEncoder().encode(Sessions.jwt_secret);
    return await new SignJWT(data).setProtectedHeader({alg:'HS256'}).setExpirationTime(Sessions.is_development ? '1y' : '1h').setIssuedAt().sign(JWT_SECRET);
}