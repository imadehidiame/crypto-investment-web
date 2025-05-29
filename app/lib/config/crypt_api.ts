export const CURRENCIES = {
    btc_:'bc1qt07xsg0czkz49dvk6z7xcjfnm6y9204hqp7t5s',
    //usdt_:'0xb74C634dcF3a86B7A340e8CE2FE7D832C8A5C3b8',
    //usdc_:'0xb74C634dcF3a86B7A340e8CE2FE7D832C8A5C3b8',
    eth_:'0xb74C634dcF3a86B7A340e8CE2FE7D832C8A5C3b8',

    btc:'bc1q5aq0m0zmpft36dkx9kmhnhc9syrv8kuh2t7xmk',
    //usdt:'0xb74C634dcF3a86B7A340e8CE2FE7D832C8A5C3b8',
   // usdc:'0xb74C634dcF3a86B7A340e8CE2FE7D832C8A5C3b8',
    eth:'0xF0cac124Bb03f9EFBe308390EF488d98f1007334',
    email:'imadehidiame@gmail.com',
    callback_url:(user_id:string,payment_id:string)=>{
        return `https://coininvestdesk.com/api/payment-callback/${user_id}/${payment_id}`
    },
    callback_url_path:(user_id:string,payment_id:string)=>{
        return `/api/payment-callback/${user_id}/${payment_id}`
    }
}