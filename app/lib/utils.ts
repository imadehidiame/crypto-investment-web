import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrXdJth7kUf+OR
H3SR/Bqp5Dm50tvlCy6JrFBkusop0l9TxFW6kgYTG9fRReQxqP2PYJsT0jmzuMms
TfEcq++8u5Lb9T5p8u0TLrN20+azm3u3MPQGM7EKKYV9t70y0UYCUvjagpEASSUo
PaUN0O15iKBaTDfX/7A4fc8awog6bUfdN9+lqmhYhoV2sdUwf8eggBpMC8GvmxDK
SJ8nI4rdqbmSZMQwGVlXMazIMTWgBABGhXGAPyTtHc+7G1zON5/Qanq/p/ma9U8r
9x9hIwQfB9n/SALlvWGBDKJKveKvCMWP9foGuEK3oM/XlRT4WgZS2RYA65bWIoow
vosBCgerAgMBAAECggEAIibnmgaTfx9htflj3Pg2RCeEzaDVTBdnZe6ecwS654zS
jLozL6SMa2CAKWfZa4A3UEy7ez7JWyT3pExAQiuN8robMZT1pF3Sm6ESCRt//cl9
5WtvJpFEtjbCMOTeYvNMFYh9qeadiUYKjrOCYneB7FerRXOtKXH+p7ODA91DEwmC
5BwTHzby/PIMbsr6o5A5X0eWFxqSBMgmB2QdeqIZlvf7tRwfET2+HUNEes+kmD4m
X9tvwhP39Z6UWzKZdo0+5WBQX3tPaC/dDl8Wdx9G1yhQyLjqNdw+U18qQBBKsNNq
+4AriIvCYjqi//dKBvsrjyiF549tQ25of4gY5HrjoQKBgQDX1s4pWOHrCSF2C+J7
IjMrNrG7p9L7sS354WvKikLH9WdBPu7IfUJ4iGErtmjFJaUuo7+rrp0XDX3Nn502
qxdxTChIdZu0wH6vXRYWcmR60/eWclg8aF+dIMSXul8zrnFaj5dJivq2bHbeingv
nXN/X9TvxZIC25tjzdrnfnvPuwKBgQDLQKBpgAlh2iUTyoyuvP/vjE20sWthC5Me
K7dvhOo+WU2b/y7KkrLTf8dHCAUEHCgVKKqJKlR0qnBSMuB4jbzWotnATDXN46GL
UjfUEP26gEuETy6OefJpk0WZP/puxQskYg4Skareyqnjm75nH6USLwLfxFmK0/sC
SJzzmvFQ0QKBgCJusy7nbgsHxt3FIZlRKGaRcCMmr8LVTidZ7c8+5U5u+Mzw1DkJ
uovt/cpybB5fVg2ts8sYrRjbXyFpgDQTcUbyxk5g7LkWKF+jcv2bvCnYHNxUW30v
jWlMq/AknEFrZ8vxsknaMQrfHMt9vZSjAqTkTdz+YL+x9wUh9vUNOYU3AoGAaKU3
cdn3+qdj25K3Z+frJZxpDZUjIe3hqvD7GrGmIL+904lIwAdThs0M/qdEXd9ZS7uK
QeDHZuGxvsBvDeJ7zU4/KmCSexStwZttHwQ4fmM7fj1+TODATFcEyGhGOe29VNgf
QrQ480gIvCUdnN6QEJKfujHPoEiPvZdBJ7Mod2ECgYEAk0kjh6DjpzkSRlRpSSUR
oUZ/kP0gXT6GPDPDdfO2DLhef3C6mfyXtRJg1sGrz0rxQW+XQmqlUlyVr47qHBez
AwXfYVSdBD7x3Vx6mrRAVHLz9yKJ79rPuhIb1kFN7OtYEnGAjadLkhdpLbxKv/vl
vZdD98rf6cghyOxch5amP8Y=
-----END PRIVATE KEY-----`;

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq13SbYe5FH/jkR90kfwa
qeQ5udLb5QsuiaxQZLrKKdJfU8RVupIGExvX0UXkMaj9j2CbE9I5s7jJrE3xHKvv
vLuS2/U+afLtEy6zdtPms5t7tzD0BjOxCimFfbe9MtFGAlL42oKRAEklKD2lDdDt
eYigWkw31/+wOH3PGsKIOm1H3TffpapoWIaFdrHVMH/HoIAaTAvBr5sQykifJyOK
3am5kmTEMBlZVzGsyDE1oAQARoVxgD8k7R3Puxtczjef0Gp6v6f5mvVPK/cfYSME
HwfZ/0gC5b1hgQyiSr3irwjFj/X6BrhCt6DP15UU+FoGUtkWAOuW1iKKML6LAQoH
qwIDAQAB
-----END PUBLIC KEY-----`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function extract_body(request:Request){
    const req_body = request.body;
    const read_data = req_body?.getReader();
    let done = false;
    let read_body = ''
    while(!done){
        const {done:read_done,value} = await read_data?.read()!
        if(read_done){
            done = true;
        }else{
            read_body+=(new TextDecoder('utf-8')).decode(value)
        }
    }
    return read_body;
}

export const is_binary_file = (response:Response)=>{
    //console.log('Response type\n',response.headers.get('Content-Type'));
    const headers = ['image/','application/','text/','audio/','video/','application/vnd','application/octet-stream'];
    return headers.some(e=>response.headers.get('Content-Type')?.startsWith(e) && response.headers.get('Content-Type') !== 'application/json');
  }

  export const evaluate_file_extension = (response:Response) =>{
    const content_type = response.headers.get('Content-Type');
    if(!content_type)
      return '';
    if(content_type === 'image/svg+xml'){
      return 'svg';
    }
    else{
      const exts = content_type.split('/');
      return exts[exts.length - 1];
    }
  }

export const fetch_request_mod = async <T>(method:'POST'|'GET'|'PATCH'|'DELETE',action:string,body?:string|FormData|any|null,is_json?:boolean,binary?:{
    display:'text'|'object_url'|'body'|'download',
    extension?:string;
  }): Promise<{
    data?:any,
    served?:T,
    is_error?:boolean,
    status?:number
  }> => {
    //console.log({body,is_json,method});
    try {
        if(method === 'POST' || method === 'PATCH'){
                body = body instanceof FormData || typeof body == 'string' || body instanceof URLSearchParams ? body :  JSON.stringify(body);
        }
        const response = is_json ? await fetch(action,{method,body,headers:{'Content-Type':'application/json'}}) : method === 'GET' || method === 'DELETE' ? await fetch(action,{method}) : await fetch(action,{method,body});
        const {status,statusText,ok} = response.clone(); 
        console.log({status,statusText,ok});
        if(!ok || status !== 200){
            //console.log(await response.text()); 
            if(statusText)
            return { is_error:true,data:statusText,status };  
            return {is_error:true,status,data:'Unspecified error'}; 
        }
        if(is_binary_file(response.clone())){
          if(binary?.display === 'body'){
            return {data:response.body,status};
          }else {

          let chunks = [];
          let total_length = 0;
          const reader = response.body?.getReader();
          while(true){
            const {value,done} = (await reader?.read())!;
            if(done){
              break;
            }
            chunks.push(value);
            total_length+=value.length;
          }
          
          if(binary?.display === 'text'){
            let uint8array = new Uint8Array(total_length);
            let offset = 0;
            for (const chunk of chunks) {
              uint8array.set(chunk,offset);
              offset += chunk.length;
            }
            const text_decoder = new TextDecoder('utf-8');
            return {data:text_decoder.decode(uint8array),is_error:false};
          }
          const blob = new Blob(chunks,{type:response.headers.get('Content-Type') as string});
          //console.log('Blob data \n',blob);
          const url = URL.createObjectURL(blob);
          if(binary?.display === 'download'){
            const a = document.createElement('a');
            a.href = url;
            if(binary.extension)
            a.download = `download_file.${binary.extension}`;
            else
            a.download = `download_file.${evaluate_file_extension(response)}`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            return {data:null,status,is_error:false};
          }
          return {data:url,status,is_error:false};
          }
          
        }else{

          const contentType = response.headers.get("Content-Type");
          if (!contentType?.includes("application/json")) {
            return {served:await response.text() as T,status,is_error:false};
          }
            return {served:await response.json(),status,is_error:false};
        }
        
    } catch (error) {
      console.log('Error during fetch\n',error);
        return {is_error:true,data:null}
    }
}

export async function sign_response(data:string){
    const { createSign } = await import('node:crypto');
    const signer = createSign('RSA-SHA256');
    signer.update(data);
    const signature = signer.sign(PRIVATE_KEY,'base64');
    return {data,signature};
}

function generateRandomChar() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
export function generateRandomString(length:number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += generateRandomChar();
    }
    return result;
  }
  
  //console.log(generateRandomChar());        
  //console.log(generateRandomString(10));   
  export const is_same_year = (today: Date, check: Date) => today.getFullYear() == check.getFullYear();
  
  export function extract_date_time(date: Date | string,use_full_data?:boolean) {
    if (typeof date === 'string') date = new Date(date);
    let dating = '';
    const today = new Date();
    const date_today = today.getDate();
    const date_difference = date_today - date.getDate();
    if (date_difference == 1) {
      dating = 'Yesterday ';
    } else if (date_difference < 0 || date_difference > 1) {
      dating = is_same_year(today, date)
        ? use_full_data ? date.toDateString().split(' ').slice(0, 3).join(' ') + ' ' : date.toLocaleDateString()+' '
        : use_full_data ? date.toDateString() + ' ' : date.toLocaleDateString()+' ';
    }
    return dating + date.toTimeString().split(' ').slice(0, 1).join();
  }

  // app/lib/utils.ts
export function extract_date_time_mod(date: Date, includeTime: boolean = true): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      ...(includeTime && { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      timeZone: 'UTC', // Ensure consistent timezone
    };
    return new Date(date).toLocaleString('en-US', options);
  }

export function generateSecureRandomString(length:number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    const randomValues = new Uint32Array(length);
    //if(window && typeof window !== 'undefined'){
    //window.crypto.getRandomValues(randomValues);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % charsLength];
    }
    return result;
    //}
  }
  
  //console.log(generateSecureRandomString(12)); // String of 12 cryptographically secure random characters

export async function verify_request(data:string,signature:string){
    const { createVerify } = await import('node:crypto');
    const verifier = createVerify('RSA-SHA256');
    verifier.update(data);
    return verifier.verify(PUBLIC_KEY,signature,'base64');
}


export function strip_field_props<T>(field_errors:T):Partial<Record<keyof T,string[]|string>>{
  const ret: Partial<Record<keyof T,string[]|string>>  = {};
  const keys = Object.keys(field_errors ?? {}) as (keyof T)[];
  for (const key of keys) {
    const errors = field_errors[key] as string[] | undefined;
      if(errors && errors.length > 0)
        ret[key as keyof T] = errors;
  }
  return ret;
}


export class NumberFormat  {
  static max_length(number:string|number,lent:number){
      let num = typeof number == 'string' ? number.replaceAll((/,/gi),'') /*String.prototype.replaceAll.apply(number,[/,/gi,''])*/ : number.toString().replaceAll((/,/gi),'');
      num = num.replace(/\D/g,"");
      if(num.length > lent){
          return num.substring(0,lent);
      }
      return number;
  }
  suffix(value='',suffix='',flag={replace_all:true,add_suffix:false}){
  
      if(flag.replace_all){
          let reg = new RegExp(`\\`+`${suffix}`,'gi');
          //console.log('Test is');
          //console.log(reg.test(value));
          //console.log('Reg is');
          //console.log(reg);
          value = value.replaceAll(reg,'');
          //value = String.prototype.replace.apply(value,[reg,'']);
      }else{
          while (value.charAt(value.length - 1) == '?') {
              value = value.substring(0,value.length-1);
          }   
          //do {
              
          //} while (value.charAt(value.length - 1) == '?');
      }
      return flag.add_suffix ? value+suffix : value;
      /*number = String.prototype.replace.apply(number,[/,/gi,'']);
      number = number.replace(/\D/g,"");
      if(number.length > lent){
          return number.substring(0,lent);
      }
      return number;*/
  }
  //thousands(number=0,flag={allow_decimal:false,length:2,add_if_empty:false,allow_zero_start:false,total_length:0}){
    static thousands(number:string|number,flag?:Partial<{allow_decimal?:boolean,length_after_decimal?:number,add_if_empty?:boolean,allow_zero_start?:boolean,total_length?:number}>){
      let numb = typeof number === 'number' ? number.toString() : number;
      if(numb === '')
        return '';
      let num_array:string[]=[];
      if(flag){
        //console.log(flag);
          if(flag.allow_decimal){
              const add_extra_digits = (start=0,end=1,n='')=>{
                  for (let index = start; index < end; index++) {
                      n+='0';
                  }
                  return n;
              }
              //console.log('I allow decimal');
              num_array = numb.split('.');    
              const length = flag.length_after_decimal ?? 2;
              if(flag.add_if_empty){
                  if(num_array.length < 2){
                      let n = '';
                      
                      for (let index = 0; index < length; index++) {
                          n+='0';
                      }
                      num_array.push(add_extra_digits(0,length,''));
                  }else{
                      num_array[1] = num_array[1].replaceAll(/\D/g,"");
                      num_array[1] = num_array[1].length >= length ? num_array[1].substring(0,length) : add_extra_digits(num_array[1].length,length,num_array[1]);
                  }
              }     
              if(num_array.length >= 2){
                  num_array = num_array.splice(0,2);
                  num_array[1] = num_array[1].replace(/\D/g,"");
                  num_array[1] = num_array[1].substring(0,length);
              }
              
              numb = num_array[0];
          }
      }
      
      numb = numb.replace(/,/gi,'');
      numb = numb.replace(/\D/g,"");
      
      if(flag && flag.hasOwnProperty('allow_zero_start') && !flag.allow_zero_start){

          while (String.prototype.charAt.apply(numb,[0])=="0") {
              if(numb.length >= 2)
              numb = numb.substring(1);
              else
              numb = '';
          }

          if(numb == '')
          return '';
          
      }

      if(flag && flag.total_length && typeof flag.total_length == 'number' && flag.total_length>0){
          numb = numb.substring(0,flag.total_length);
      }
      
      let length = numb.length;
      let string_array = [];  
      if(length>3){
          let number_of_commas = parseInt((length/3).toString());
          let first_position = length%3;
          if(first_position == 0){
              number_of_commas -= 1;
              first_position = 3;
          }
          string_array = numb.split('');
          string_array[first_position-1]=string_array[first_position-1]+",";
          number_of_commas -=1;
          while(number_of_commas > 0){
          first_position+=3;
          string_array[first_position-1]=string_array[first_position-1]+",";
          number_of_commas -=1;    
          }
      }else{
          if(flag && flag.allow_decimal){
             if(num_array.length > 1){
              return numb+"."+num_array[1];//.replace(/\D/g,"").substring(0,flag.length);
             } 
          }
          return numb;   
      }
      if(flag && flag.allow_decimal){
  
          if(flag.add_if_empty || num_array.length > 1){
              return string_array.join('')+"."+num_array[1];//.replace(/\D/g,"").substring(0,flag.length);
          }else{
              return string_array.join('');
          }
  
       }
      return string_array.join('');
      }
      static numbers_only(number:string|number,flag?:Partial<{allow_decimal?:boolean,length_after_decimal?:number,allow_zero_start?:boolean,total_length?:number,format_to_thousand?:boolean}>){
          if(typeof number == 'number')
            number = number.toString();
          let num_array:string[]=[];
          if(flag){
          if(flag.hasOwnProperty('allow_decimal') && flag.allow_decimal === true){
              num_array = number.split('.');         
              if(num_array.length > 2)
              num_array = num_array.splice(0,2);
              number = num_array[0];
          }
          //console.log(num_array);
          }
          //number = String.prototype.replace.apply(number,[/,/gi,'']);
          number = number.replaceAll(/\D/g,"");

          if(flag && flag.allow_zero_start == false){
  
              while (String.prototype.charAt.apply(number,[0])=="0") {
                  if(number.length >= 2)
                  number = number.substring(1);
                  else
                  number = '';
              }
  
              if(number == '')
              return '';
              
          }

          if(flag && flag.total_length && typeof flag.total_length == 'number' && flag.total_length>0){
              number = number.substring(0,flag.total_length);
          }
          
  
          if(flag && flag.allow_decimal){
              if(num_array.length > 1){
                return number+"."+num_array[1].replace(/\D/g,"").substring(0,flag.length_after_decimal);
              } 
           }
           if(flag && flag.format_to_thousand){
            number = this.thousands(number,flag);
           }
  
          return number.toString();
          
      }
      /*update_key (object:
          Partial<{
              name:{
                  first:'First',
                  last:'Last'
              }
          }>
      ,obj_key='first',val='Ehidiamen'){
          for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                  if(key == obj_key){
                      object[key as keyof typeof object.name] = val;
                  }
                  if( typeof object[key] == 'object'){
                      return update_key(object[key],obj_key,val);
                  }
              }
          }
          
      }*/
      static splice_data(data:any[],delete_start:number|number[],length=1){
          if(typeof delete_start === 'number')
          if(/^[0-9]+$/.test(delete_start.toString())){
              let ret_array:any[] = [];
              let check_array = [];
              //const m = (delete_start as number) + length;
              for (let index = delete_start; index < (delete_start+length); index++) {
                  check_array.push(index);
              }
              data.forEach((element,index) => {
                  if(!check_array.includes(index))
                      ret_array.push(element);
              });
              return ret_array;
          }
          if(Array.isArray(delete_start)){
              let ret_array:any[] = [];
              data.forEach((element,index) => {
                  if(!delete_start.includes(index))
                      ret_array.push(element);
              });
              return ret_array;
          }
          return data;
       }
       turn_obj (arr=[],obj={}){
          arr.forEach(element => {
             obj = obj[element]; 
          });
          return obj;
      }
  }

  export const fetch_request = async <T>(method:'POST'|'GET'|'PATCH'|'DELETE',action:string,body:string|FormData|null,server_key='data')=>{
            try {
                let server_data = null;
                if(method === 'POST' || method === 'PATCH'){
                    //if(typeof body !== 'string'){
                        server_data = body instanceof FormData ? body : typeof body == 'string' ? body : JSON.stringify(body);
                    //}else{
                      //  server_data = body
                    //}
                }
                //log(server_data,'Served data');
                const response = await fetch(action,{method,body:server_data,headers:{'Content-Type':'application/json'}});
                //console.log('Response daya');
                //console.log(response);
                if(!response.ok || response.status !== 200){
                    console.log(await response.text());
                    if(response.statusText)
                    return { is_error:true,data:null };
                }
                const contentType = response.headers.get("Content-Type");
                //console.log('Headers');
                //console.log(response.headers);
                if (!contentType?.includes("application/json")) {
                    console.error("Unexpected response type:", contentType);
                    //console.error(await response.text()); 
                    return {is_error:true,data:null};
                }
                const {data} = await response.json();
                
                //console.log(data);
                return {is_error:!data.logged,data:data[server_key] as T};
            } catch (error) {
                return {is_error:true,data:null}
            }
  }


  export const get_earnings = (date:Date,percentage:number,investment:number,endDate:Date)=>{
    let days_in_milliseconds = Date.now() - date.getTime();
    let day_in_milliseconds = 86400 * 1000;
    let days = 0;
    if(Date.now() > endDate.getTime()){
        days = (endDate.getTime() - date.getTime())/day_in_milliseconds;
    }else{
        if(days_in_milliseconds > day_in_milliseconds)
            days = Math.floor(days_in_milliseconds/day_in_milliseconds);    
    }
    
    /*while(days_in_milliseconds > (86400*1000)){
      days+=1;
      days_in_milliseconds -= (86400*1000);
    }*/
    if(days == 0)
      return 0;
    let daily_percentage = (percentage/100)*investment;
    return parseFloat((daily_percentage*=days).toFixed(2));
  }
  
  export const is_transaction_active = (date:Date)=>Date.now() < date.getTime();


export function log(value:any,title?:string){
  console.log(title?title+'\n':'Logged content\n',value);
}

export function get_url_paths(request:Request|string,segment?:number){
  const url = new URL(typeof request === 'string' ? request : request.url);
  const paths = url.pathname.split('/').slice(1);
  if(segment){
    return paths.length > segment ? paths[segment] : undefined;
  }
  //console.log({pathname:url.pathname});ik8
  return {paths,pathname:url.pathname};
}

export function create_cookie(name:string,value:string,days:number){
    let expires = ``;
    if(days){
        const date = new Date();
        date.setTime(date.getTime()+(24*60*60*1000*days));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/; secure; SameSite=Strict`; 
}
interface NavigationOptions {
  cookie?:{
    name:string;
    value:string;
    duration:number
  };
  replace?:boolean
}
export function force_navigate(route:string,navigation_init:NavigationOptions){
    //LoadAnimation.show('circular');
    if(navigation_init.replace){
      if(navigation_init.cookie){
        const {name,value,duration} = navigation_init.cookie
        create_cookie(name,value,duration);
      }
      history.replaceState({},'',route);
      location.reload();
    }else{
      if(navigation_init.cookie){
        const {name,value,duration} = navigation_init.cookie
        create_cookie(name,value,duration);
      }
    }
    history.pushState({},'',route);
    location.reload();
}