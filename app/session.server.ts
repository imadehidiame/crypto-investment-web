import crypto from 'crypto'
import { createCookie, redirect, type Cookie } from 'react-router';
//import sessionEnv, { type DBSessionData, type SessionData } from './lib/config/session';
import Session from './models/Session.server';
import mongoose from 'mongoose';
import { ConnectToDB } from './db.server';
import { log } from './lib/utils';
import { jwtDecrypt, jwtVerify, SignJWT } from 'jose';
import type { DBSessionData } from './lib/config/session';

export const generateSessionToken = ():string =>{
    return crypto.randomBytes(32).toString('hex');
}

const DURATION = 60 * 60 * 24 * 365 * 1000;

export const create_flash_session = async (data?:any|string,set_session?:boolean,clear_session?:boolean)=>{

    if(!data){
        return createCookie('fdm', {});
    }

    const {Sessions} = (await import('@/config.server')).default
    if(typeof data == 'string')
        data = JSON.parse(data);
    const signed_data = await new SignJWT(data).setProtectedHeader({alg:'HS256'}).setExpirationTime('1 minute').setIssuedAt().sign((new TextEncoder()).encode(Sessions.jwt_secret));
    return await createCookie('fdm',!set_session ? {} : {
        secure:!Sessions.is_development,
        sameSite:'lax',
        //name:'',
        path:'/',
        //secrets:[Sessions.secret as string],
        maxAge: clear_session ? 0 :60,
        httpOnly:true,
    }).serialize(signed_data) ;
    //return m;
}

export const get_flash_session = async(request:Request)=>{
    try {
        const cookie = await (await create_flash_session() as Cookie).parse(request.headers.get('Cookie'));
        log(cookie,'Cookie value');
        return await decrypt_data<{m:string}>(cookie)    
    } catch (error) {
        return null;
    }
}

export const sessionStore = async (set_session?:boolean,clear_session?:boolean,session_name?:string,session_time_in_seconds?:number,serialize_data?:any) => {
    const {Sessions} = (await import('@/config.server')).default
    //return ((await sessionStore(false,undefined,is_user ? Sessions.name : Sessions.adm_name)) as Cookie).parse(request.headers.get('Cookie'));
    if(serialize_data){
        if(typeof serialize_data === 'string'){
            serialize_data = JSON.parse(serialize_data);
        }
        
       const data = await new SignJWT(serialize_data).setProtectedHeader({alg:'HS256'}).setExpirationTime('1 minute').setIssuedAt().sign((new TextEncoder()).encode(Sessions.jwt_secret)); 

       let m = await createCookie( session_name ? session_name : Sessions.name as string , !set_session ? {} : {
        secure:!Sessions.is_development,
        sameSite:'lax',
        //name:'',
        path:'/',
        //secrets:[Sessions.secret as string],
        maxAge: clear_session ? 0 : session_time_in_seconds ? session_time_in_seconds : DURATION/1000,
        httpOnly:true,
        }).serialize(data);
        return m;
    }
    

    if(session_name)
     
        return createCookie( session_name , !set_session ? {} : {
            secure:!Sessions.is_development,
            sameSite:'lax',
            //name:'',
            path:'/',
            //secrets:[Sessions.secret as string],
            maxAge: clear_session ? 0 : session_time_in_seconds ? session_time_in_seconds : DURATION/1000,
            httpOnly:true,
    });
    
    



    return createCookie( session_name ? session_name : Sessions.name as string, !set_session ? {} : {
        secure:!Sessions.is_development,
        sameSite:'lax',
        //name:'',
        path:'/',
        //secrets:[Sessions.secret as string],
        maxAge: clear_session ? 0 : session_time_in_seconds ? session_time_in_seconds : DURATION/1000,
        httpOnly:true,
});

}

export const encrypt_data = async (data:any,encode_key?:Uint8Array<ArrayBufferLike>,expire?:string) =>{
    const {Sessions} = (await import('@/config.server')).default
    return await new SignJWT(data).setProtectedHeader({alg:'HS256'}).setExpirationTime(expire ? expire : '1y').setIssuedAt().sign(encode_key ? encode_key : (new TextEncoder()).encode(Sessions.jwt_secret));
}

export const decrypt_data = async <T>(session:string,key?:Uint8Array<ArrayBufferLike>) => {
    const {Sessions} = (await import('@/config.server')).default
    const decrypt = (await jwtVerify(session,key ? key : (new TextEncoder().encode(Sessions.jwt_secret)),{algorithms:['HS256']}));
    return decrypt ? <T>decrypt.payload : null;
}

export const getSession = async (request:Request,is_user=true) =>{
    const {Sessions} = (await import('@/config.server')).default
    //const { Sessions} = await Session;
    return ((await sessionStore(false,undefined,is_user ? Sessions.name : Sessions.adm_name)) as Cookie).parse(request.headers.get('Cookie'));
} 

export const createDbSession = async (userId:mongoose.Types.ObjectId|string):Promise<string> => {
    await ConnectToDB();
    //const m = new mongoose.Types.ObjectId(userId)
    const token = generateSessionToken(); 
    const session = new Session({
       token,
       userId : typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId,
       expiresAt: new Date(Date.now() + DURATION) 
    });
    await session.save();
    return token;
}

export const getUserFromSession = async (request:Request,is_user = true) => {
    //log(is_user===false,'IS ADMIN');
    const {Sessions} = (await import('@/config.server')).default
    const token = await getSession(request,is_user);
    //log(token,'Session Token');
    if(!token) 
        return null;
    const token_value = <{token:string}>(await decrypt_data(token));
    await ConnectToDB();
    const session = await Session.findOne({token:token_value.token}).populate('userId','name email role');
    if(!session || session?.expiresAt < new Date()){
        const expired_session = await ((await sessionStore(true,true,is_user ? Sessions.name : Sessions.adm_name)) as Cookie).serialize('');
        throw redirect('/auth',{headers:{'Set-Cookie':expired_session}});
    }
    //check if session wihin 7 days of expiry
    const currentExpiry = (session.expiresAt as Date).getTime();
    const sevenDaysLater =  (7 * 60 * 60 * 24 * 1000);
    if((currentExpiry - Date.now()) < sevenDaysLater){
       session.expiresAt = new Date(Date.now()+DURATION);
       //await ((await sessionStore(true,false,is_user ? Sessions.adm_name : Sessions.name)) as Cookie).serialize(await encrypt_data(token_value,new TextEncoder().encode(Sessions.jwt_secret),'1y'));
       await session.save(); 
    }
    const user = session.userId as DBSessionData;
    return user;
    //return {role:user.role,email:user.email,name:user.name,id:user._id};
    //return data
}

export const destroySession = async (request:Request,is_user = true) =>{
    const {Sessions} = (await import('@/config.server')).default
    await ConnectToDB();
    const token = await getSession(request,is_user); 
    if(token){
        const token_value = <{token:string}>(await decrypt_data(token));
        try {
             await Session.deleteOne({token:token_value.token});
        } catch (error) { 
           log('Error deleting session','DB error'); 
        }
    } 
    return await ((await sessionStore(true,true,is_user ? Sessions.name : Sessions.adm_name)) as Cookie ).serialize('');
}

/*export const sessionStore = createSessionStorage({
    cookie:{
        secure:process.env.NODE_ENV === 'production',
        sameSite:'lax',
        name:'',
        path:'/',
        secrets:[''],
        maxAge:DURATION/1000,
        httpOnly:true,
        
    },
    async createData(data, expires) {
        const dat = Object.assign({},data);
        return this.createData(Object.assign({},data),expires);
    },
    async readData(id) {
        return this.readData(id);
    },
    async deleteData(id) {
        await this.deleteData(id);
    },
    async updateData(id, data, expires) {
        await this.updateData(id,data,expires);
    },
})*/
