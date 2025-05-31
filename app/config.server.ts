import dotenv from 'dotenv';

dotenv.config();

export const sessionEnv = {
    Sessions : {
        secret:process.env.SESSION_SECRET,
        name:process.env.SESSION_NAME,
        adm_secret:process.env.ADM_SESSION_SECRET,
        adm_name:process.env.ADM_SESSION_NAME,
        jwt_secret:process.env.AUTH_KEY_NAME,
        is_development:process.env.NODE_ENV === 'development' 
    }, 
    MongoDb : {
        connection_url:process.env.MONGO_DB_CONNECTION_STRING
    }
}

export default sessionEnv;

