import { log } from "@/lib/utils";
import { logout } from "@/auth.server";
import { redirect } from "react-router";
import type { Route } from "./+types/logout";



export const action = async ({request}:Route.ActionArgs)=>{
  try {
    
  const role = (await request.formData()).get('role');
  //const validate = loginSchema.safeParse(data);
  
  const expired_session = await logout(request,role === 'user');
  
  return role === 'admin' ? redirect('/auth?no_route=1',{headers:{'Set-Cookie':expired_session as string}}) : redirect('/auth',{headers:{'Set-Cookie':expired_session as string}}) ;

  } catch (error) {
   log(error,'Error in action');
   return {data:{logged:false,error:error}};
  }
}