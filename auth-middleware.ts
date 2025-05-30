import { getRequiredRolePath, hasRequiredRole } from "@/auth.server";
import type { RouterContext } from "@/lib/config/session";
import { log } from "@/lib/utils";
import { getUserFromSession } from "@/session.server";
import { redirect, unstable_createContext, type unstable_MiddlewareFunction, unstable_RouterContextProvider } from "react-router";



const authSessionContext = unstable_createContext<RouterContext | null>(null);

function get_url_path(request:Request|string){
  const url = new URL(typeof request === 'string' ? request : request.url);
  return {paths:url.pathname.split('/').slice(1),pathname:url.pathname};
}

export const AuthMiddleware: unstable_MiddlewareFunction<Response> = async ({request,context,params},next) =>{

  const url = new URL(request.url);
  const pathname = url.pathname;
  const paths = pathname.split('/');
  if(pathname.startsWith('/auth') && paths.length === 2 && paths[1] === 'auth'){
    if(url.searchParams.get('no_route') === '1'){
      throw await next();
    }
  }
  const role_for_route = getRequiredRolePath(pathname);
  //log(role_for_route,"ROLE FOR ROUTE");
  //log(role_for_route,'Role for current route');
  const user = await getUserFromSession(request,role_for_route === 'admin' || role_for_route === 'user' ? role_for_route === 'user' ? true : false : true);
  const isAuthenticated = !!user;
  context.set(authSessionContext,{isAuthenticated,user});
  const allowed_urls = ['/api/payment-callback'];
  const isAllowed = allowed_urls.some(e=>pathname==e);
  if(isAllowed){
    return next();
  }
  
  //log({user,isAuthenticated},'Authenticated user');
  if(isAuthenticated){
    //user has active session
    const role = user.role;

    //log(role,'User or admin role');
    
    if(role_for_route && !hasRequiredRole(role,role_for_route)){
      throw role_for_route == 'admin' ? redirect('/dashboard/adm') : redirect('/dashboard');
    }
    if(pathname.startsWith('/auth') && paths.length === 2 && paths[1] === 'auth'){
      throw role_for_route == 'admin' ? redirect('/dashboard/adm') : redirect('/dashboard');
    }
    return next();
  }else{
    //no active session
    const protected_routes = ['/dashboard/adm','/dashboard'];
    const is_protected_route = protected_routes.some(route=>pathname.startsWith(route));
    if(is_protected_route){
      throw redirect(`/auth?redirect_to=${encodeURIComponent(pathname)}`)
    }else{
      return next()
    }
  }
}

export function getAuthSession(context:unstable_RouterContextProvider) {
  if(!authSessionContext){
    //console.log('Null blocked');
    return null
  }
  if(context.get(authSessionContext)){
    //console.log('Null block 1 unbelievable');
    return context.get(authSessionContext);
  }
  //console.log('Null block 2 believable');
  return null
}
