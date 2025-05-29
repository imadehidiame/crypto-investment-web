import LoginPage, { loginSchema } from "@/components/app/index/auth/login-page";
import type { Route } from "./+types/auth";
import { log, strip_field_props } from "@/lib/utils";
import { login } from "@/auth.server";
import { redirect } from "react-router";
import { z } from "zod";


export const action = async ({request}:Route.ActionArgs)=>{
  try {
    const data = await request.json();
  const validate = loginSchema.safeParse(data);
  if(validate.error){
    return {data:{logged:false,error:'Validation errors',errors:strip_field_props(validate.error.flatten().fieldErrors)}};
  }
  const {logged,message,session,role} = await login(validate.data);
  log({logged,message,session,role},'Login Data');
  if(!logged){
    return {data:{logged:false,error:message}};
  } 

  log({logged,message,session,role},'Login Data')
  
  return role === 'admin' ? redirect('/dashboard/adm',{headers:{'Set-Cookie':session as string}}) : redirect('/dashboard',{headers:{'Set-Cookie':session as string}}) ;

  } catch (error) {
   log(error,'Error in action');
   return {data:{logged:false,error:error}};
  }
  

}


export default function(){
  return <LoginPage />
}