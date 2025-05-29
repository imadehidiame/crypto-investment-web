import LoadingAnime from "app/components/loader/loading-anime";
import { ToastProvider } from "app/components/ui/providers/toast-provider";
import { Outlet, unstable_createContext, unstable_RouterContextProvider, useNavigation, type unstable_MiddlewareFunction } from "react-router";

//import { get_decrypted_session_data } from "app/lib/utils/session_util";
//import type { SessionPayloadData } from "app/definitions/auth_definition";
import type { Route } from "./+types/app-layout";
import { get_url_paths } from "@/lib/utils";
import DeleteAlertProvider from "@/components/ui/providers/delete-alert-provider";
import type { RouterContext } from "@/lib/config/session";
import { getUserFromSession } from "@/session.server";
import { getRequiredRolePath } from "@/auth.server";
//import type { Route } from "../+types/home";
//import type { Route } from "./+types/home";
//import type { Route } from "./+types";
let auth_context = unstable_createContext<RouterContext>();

const auth_middlee: unstable_MiddlewareFunction = async ({ request, context }, next) => {
    const url = new URL(request.url);
    //const search = request.url.split('?');
    ///console.log(search.get('name'));
    const pathname = url.pathname;
    const role_for_route = getRequiredRolePath(pathname);
    //log(role_for_route,'Role for current route');
    const user = await getUserFromSession(request,role_for_route === 'admin' || role_for_route === 'user' ? role_for_route === 'user' ? true : false : true);
  //const user = await getUserFromSession(request,false);
  context.set(auth_context,{isAuthenticated:!!user,user});
  return next();
};

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  
  return {}; // Always return an object to avoid undefined
};

export default function AppLayout() {
  const navigation = useNavigation();
  const loading_state = navigation.state === "loading" || navigation.state === "submitting";
  return (
    <>
      {loading_state && <LoadingAnime />}
      <ToastProvider />
      <DeleteAlertProvider />
      <Outlet />
    </>
  );
}

export function getSess(context: unstable_RouterContextProvider, request?: Request) {
  try {
    if (!auth_context) {
      //console.log("auth_context is null");
      return null;
    }
    if (!context) { 
      //console.log("context is null");
      return null;
    }
    const session = context.get(auth_context);
    if (!session) {
      //console.log("No session found in context");
      return null;
    }
    //console.log("Session found:", session);
    return session;
  } catch (error) {
    console.error("Error in getSess:", error);
    return null;
  }
}

export const unstable_middleware = [auth_middlee];