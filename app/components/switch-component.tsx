import { Form, useFetcher, useSubmit,type Fetcher } from "react-router";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Toasting } from "./loader/loading-anime";

interface SwitchProps {
    value:boolean;
    action:string;
    name:string;
    form_key:string;
    served_key:string;
    success?:string;
    error?:string;
    method:"POST"|"PATCH",
    id?:string;
    className?:string;
    use_form_data?:boolean;
    after_submit_action?:(name:string,check:boolean)=>void
}

const SwitchComponent:React.FC<SwitchProps> = ({value,action,name,form_key,served_key,className,success,after_submit_action,id,error,use_form_data,method='PATCH'}:SwitchProps)=>{
    const submit = useSubmit();
    const [check,set_check] = useState(value);
    const fetcher = useFetcher({key:form_key});

    

    const sub_check = (check:boolean)=>{
        set_check(check);
        //check is false
        return new Promise((resolve,reject)=>{
            try {
                resolve(setTimeout(()=>submit_check(check),3000))    
            } catch (error) {
                reject(error);
            }
        });
    }
    
    const submit_check_async = async (check:boolean)=>{
        try {
            const fd = new FormData();
            set_check(check);
            fd.append(name,String(check));
            const params = new URLSearchParams();
            params.append(name,String(check));

            const response = await fetch(action, {
                method,
                body: use_form_data ? params.toString() : JSON.stringify({ [name]: check }),
                headers: {
                  'Content-Type': use_form_data ? 'application/x-www-form-urlencoded' : 'application/json'
                }
              });
            if(!response.ok || response.status !== 200){
                console.log(await response.text());
                if(response.statusText)
                    Toasting.error(response.statusText,5000)
                else
                Toasting.error('An error occured while trying to update',5000)
                set_check(!check);
                return;
            }
            const contentType = response.headers.get("Content-Type");
            if (!contentType?.includes("application/json")) {
                console.error("Unexpected response type:", contentType);
                console.error(await response.text()); 
                Toasting.error("Invalid server response", 5000);
                set_check(!check);
                return;
            }

            const { data } = await response.json();
            console.log(data);
            if(data[served_key]){
                if(success)
                    Toasting.success(success,5000);
                else
                    Toasting.success('Request successful',5000);
                after_submit_action?.(id as string,check);
            }else{ 
                if(error)
                    Toasting.error(error,5000);
                else
                    Toasting.success(response.statusText ? response.statusText : 'Request failed to complete',5000);
                set_check(!check);
            }


        } catch (error) {
            console.log(error);
            Toasting.error('A network error occured',5000);
            set_check(!check);
        }
        
    }

    const submit_check = (check:boolean)=>{
        try {
            /*console.log({check});
            fetcher.submit(data,{action,method});*/    
            //const data = {'[name]':String(check)};
            const fd = new FormData();
            set_check(check);
            fd.append(name,String(check));
            fetch(action,{method,body:fd}).then(async (res)=>{
                if(!res.ok || res.status !== 200){
                    console.log('Error');
                    console.log(res);
                    set_check(!check);
                    Toasting.error('An error occured while performing action',5000)
                    //res.text().then(data=>console.error(data))
                }else{
                    console.log(res);
                    console.log('Response');
                    console.log(res.headers.values());
                    console.log(res.headers.entries())
                    console.log(res.headers.get('Content-Type'));
                    const body = res.body;
                    console.log(body);

                    const contentType = res.headers.get("Content-Type");
                        if (!contentType?.includes("application/json")) {
                            console.error("Unexpected response type:", contentType);
                            console.error(await res.text());
                            Toasting.error("Invalid server response", 5000);
                            //set_check(check);
                            return;
                        }

                    //console.log(await res.text());
                    //console.log({response:await res});

                     
                    res.json().then((data)=>{
                        console.log({data});
                        if(data.error){
                            set_check(!check);
                        }
                    }
                    ).catch((err)=>{
                        Toasting.error('An unknown client side error occured',5000);
                        console.log(err);
                        set_check(!check);
                    }
                    );
                }
            }).catch((err)=>{
                //console.log('Error');
                Toasting.error('A network error occured. Please check your internet connection',5000);
                console.log(err);
                set_check(!check);
            })
        } catch (error) {
            console.log(error);
            Toasting.error('An unknown error occured',5000);
            set_check(!check);
        }
        
    }
    
    //const inflight_response = (fetcher.formData?.get(name) && (typeof fetcher.formData.get(name) == 'boolean') ? fetcher.formData.get(name) : check) as boolean;
    //console.log({inflight_response});
    //{/*<Switch className={cn({'bg-green-600 text-green-500':check == true,"bg-destructive text-destructive":check == false})} checked={inflight_response} onCheckedChange={submit_check} />*/}
return( 
        

    <Switch className={cn({'bg-green-600 text-green-500':check == true,"bg-destructive text-destructive":check == false},className)} checked={check} onCheckedChange={submit_check_async} />
 ) 
}

export default SwitchComponent;