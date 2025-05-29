import SignupPage, { signupSchema } from "@/components/app/index/auth/signup-page";
import type { Route } from "./+types/auth-signup";
import { log, strip_field_props } from "@/lib/utils";
import { signup } from "@/auth.server";
import { redirect } from "react-router";

export const action = async ({request}:Route.ActionArgs) =>{
    try {
    const data = await request.json();
    const validate = signupSchema.safeParse(data);
    if(validate.error){
      return {data:{logged:false,error:'Validation error(s)',errors:strip_field_props(validate.error.flatten().fieldErrors)}};
    }
    const {email,password,name} = validate.data;
    const {logged,session} = await signup({name,username:email,password,role:'user'});
    if(!logged)  
      return {data:{logged:false,error:'An error occured on the server'}};
    log(session,'session string');
    return redirect('/dashboard',{headers:{'Set-Cookie':session as string}})

    } catch (error) {
      log(error,'An error on sign up action');
      return {data:{logged:false,error:'An error occured on the server'}};
    }
    
}


export default function(){
  return <SignupPage />
}