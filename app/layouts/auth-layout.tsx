import { Outlet } from "react-router";

export default function AuthLayout(){
    return (
         <div className="text-white h-[100vh] flex justify-center items-center bg-cover" style={{"backgroundImage":'url("/img/form_bg1.jpg")'}}>
            <Outlet />
        </div>
    );
}