import dotenv from 'dotenv';

dotenv.config();

export const sessionEnv = async ()=>{
    console.log('ENV FOR MG DB');
    console.log(process.env.MONGO_DB_CONNECTION_STRING)
    const Sessions = {
        secret:process.env.SESSION_SECRET,
        name:process.env.SESSION_NAME,
        adm_secret:process.env.ADM_SESSION_SECRET,
        adm_name:process.env.ADM_SESSION_NAME,
        jwt_secret:process.env.AUTH_KEY_NAME,
        is_development:true 
    }; 
    const MongoDb = {
        connection_url:process.env.MONGO_DB_CONNECTION_STRING
    }

    return {Sessions,MongoDb}
}

export default sessionEnv;

