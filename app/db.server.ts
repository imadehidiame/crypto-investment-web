import mongoose from "mongoose";
import { log } from "./lib/utils";
import sessionEnv from "./lib/config/session";

//const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb+srv://goodhitage:erbv360tJImfRsrs@cluster0.nmzdady.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

export const ConnectToDB = async () => {
    //log('About to connect to DB','Good');
    if(isConnected)
        return;
    try {
        const connect = await mongoose.connect((await sessionEnv()).MongoDb.connection_url as string);
        isConnected = true;
        //console.log("DB connected");
        //log(connect,'MONGO DB Connection');
    } catch (error) {
        log(error,'Mongo DB error');
        process.exit(1);
    }
}