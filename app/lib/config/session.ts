import type mongoose from "mongoose";

export interface DBSessionData {
    name:string;
    email:string;
    role:string;  
    expiresAt?:Date;
    _id:mongoose.Types.ObjectId
}

export interface SessionData extends DBSessionData {
    userId?:string;
    token?:string;  
}

export interface UserData {
    _id: mongoose.Types.ObjectId;
      name: string; 
      email: string;  
      role: string;
}

export interface RouterContext {
  user?: UserData | null;
  isAuthenticated: boolean;
}
