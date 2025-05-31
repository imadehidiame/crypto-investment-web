export const sessionEnv = async ()=>{
    console.log('ENV FOR MG DB');
    console.log(process.env.REACT_APP_MONGO_DB_CONNECTION_STRING)
    const Sessions = {
        secret:process.env.REACT_APP_SESSION_SECRET,
        name:process.env.REACT_APP_SESSION_NAME,
        adm_secret:process.env.REACT_APP_ADM_SESSION_SECRET,
        adm_name:process.env.REACT_APP_ADM_SESSION_NAME,
        jwt_secret:process.env.REACT_APP_AUTH_KEY_NAME,
        is_development:true 
    }; 
    const MongoDb = {
        connection_url:process.env.REACT_APP_MONGO_DB_CONNECTION_STRING
    }

    return {Sessions,MongoDb}
}

export default sessionEnv;

