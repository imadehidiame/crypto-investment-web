import React, { useEffect, useState } from 'react';
import { useNavigation, useSubmit } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
//import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NumberFormat } from '@/components/number-field';
import { extract_date_time, } from '@/lib/utils';
import { FormNumberDefault, FormSelectDefault, FormTextFieldDefault } from '@/components/form-components';





export interface Withdrawals {
  _id: string;
  amount: number;
  createdAt: Date;
  //updatedAt: Date;
  user:{
    name:string;
    _id:string;
  }
}

export interface Users {
    name:string;
    _id:string;
    balance:number;
}

interface PageProps {
  withdrawals: Withdrawals[];
  userId:string;
  users:Users[]
}

const WithdrawalPage: React.FC<PageProps> = ({ withdrawals,userId,users }) => {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [isSubmitting,set_is_submitting] = useState(false);
  const [withdrawal_state,set_withdrawal_state] = useState<typeof withdrawals>(withdrawals);
  //const [currencies, set_currencies] = useState<CryptoData[]>([]);
  //const [prices, set_prices] = useState<{btc:number,eth:number}>({btc:0,eth:0});

  const [users_state,set_users_state] = useState<Users[]>(users);
  let users_select = [{name:'Select user',value:'null'},...users_state.map((e)=>{
    return {
        name:e.name,
        value:e._id
    }
  })];

  

  const process_withdrawal = async(amount:number)=>{
    set_is_submitting(true);
    try {
        const response = await fetch('/api/process-adm-withdrawal', {
            method:'POST',
            body: JSON.stringify({ 
                user:form_object.user,
                //value_coin:form_object.calculated,
                amount,
                description:form_object.description
                //coin:type 
            }),
            headers: {
              'Content-Type' : 'application/json'
            }
          });
          set_is_submitting(false);
        if(!response.ok || response.status !== 200){
            console.log(await response.text());
            if(response.statusText)
                Toasting.error(response.statusText,5000)
            else
            Toasting.error('An error occured while trying to update',5000)
            //set_is_submitting(false);
            return;
        }
        const contentType = response.headers.get("Content-Type");
        if (!contentType?.includes("application/json")) {
            console.error("Unexpected response type:", contentType);
            console.error(await response.text()); 
            Toasting.error("Invalid server response", 5000);
            return;
        }

        const { data } = await response.json();
        //console.log(data);
        if(data['logged']){
            
            Toasting.success('WWithdrawal successful',5000);
            const withdraw:Withdrawals = {
                _id:data._id,
                createdAt:(new Date),
                amount,
                user:{
                    name:(users_select.find(e=>e.value === form_object.user)?.name)!,
                    _id:form_object.user
                }
            }
            set_withdrawal_state(prev=>([...prev,withdraw]));
            set_users_state(prev=>prev.map(e=>e._id === form_object.user ? ({...e,balance:e.balance-amount}):e));
            /*set_users_state((prev)=>{
                return prev.map(e=>e._id === form_object.user ? {...e,balance:e.balance-amount} : e )
            })*/
            //set_deposit_state(prev=>([...prev,dep]));
        }else{ 
                Toasting.error('Request failed to complete',5000);
        }
    } catch (error) {
        console.log(error);
        Toasting.error('A network error occured',5000);
        set_is_submitting(false);
    }
}

  

  const [form_object,set_form_object] = useState<{amount:string|number,user:string,description:string}>({amount:'',user:'',description:''})
  const [error_object,set_error_object] = useState<{amount:string,user:string,description:string}>({amount:' ',user:' ',description:' '});

  const is_form_valid = error_object.amount == '' && error_object.user == '';

  const validators = {
    user:(value:any)=>value.trim() !== 'null' || value.trim() !== '' ? '' : 'Please select user',
    description:(value:any)=>value.trim() === '' ? 'Please enter a short description' : '',
    amount:(value:any)=>{
        const current_user = users_state.find(e=>e._id === form_object.user);
        if(!current_user)
            return 'Please select user first';
        const user_balance = current_user.balance;
      return parseFloat((value as string).replaceAll(',','')) <= user_balance ? '' : 'Value must be equal to or less than '+user_balance
    },
    //currency:(value:any)=>value === 'eth' || value === 'btc' ? '' : 'Please select currency',
  }

  const validate_form = ()=>{
    let check = true;
     Object.entries(error_object).forEach(([name,value])=>{
      const validate = validators[name as keyof typeof validators](form_object[name as keyof typeof form_object])
      set_error_object(prev=>({...prev,[name]:validate}));
      check = check && validate=='';
    })
    return check;
  }

  const submit_form = async ()=>{
    if(!validate_form()){
      return;
    }
    await process_withdrawal(parseFloat((form_object.amount as string).replaceAll(',','')));
  }

  

  const on_change = (value:any,name:keyof typeof form_object)=>{
    /*if(name === 'amount'){
      if(value){
        if(form_object.currency){
          const calc = parseFloat((value as string).replaceAll(',','')) / prices[form_object.currency as keyof typeof prices];
          set_form_object(prev=>({...prev,calculated:(parseFloat((value as string).replaceAll(',','')) / prices[form_object.currency as keyof typeof prices]).toString()}));
        }else{
          set_form_object(prev=>({...prev,calculated:''}));
        }
      }else{
        set_form_object(prev=>({...prev,calculated:''}));
      }
      
    }else if ( name === 'currency'){
      if(value && (value == 'eth' || value == 'btc')){
        if(form_object.amount){
          const calc = parseFloat((form_object.amount as string).replaceAll(',','')) / prices[value as keyof typeof prices];
          set_form_object(prev=>({...prev,calculated:(parseFloat((form_object.amount as string).replaceAll(',','')) / prices[value as keyof typeof prices]).toString()}));
        }else{
          set_form_object(prev=>({...prev,calculated:''}));
        }
      }else{
        set_form_object(prev=>({...prev,calculated:''}));
      }
    }*/
  }

  
  return (
    <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
      <div className="space-y-6 p-4 max-sm:p-2">
        <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Withdrawal</CardTitle>

        <Card className="bg-gray-800 py-4 px-2 border border-amber-300/50">
          <CardHeader className="max-sm:p-2">
            <CardTitle className="text-lg font-bold text-amber-300">Create Withdrawal</CardTitle>
            <p className="text-sm text-gray-400">Make a withdrawl</p>
          </CardHeader>
          <CardContent className="max-sm:p-2">
            <div className='space-y-1 p-0 flex flex-wrap gap-4 items-center mb-12'>
              
            <FormSelectDefault name='user' error_object={error_object} form_object={form_object} placeholder='Select user' selects={users_select} set_error_object={set_error_object} set_form_object={set_form_object} validators={validators} className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2' id='currency' label='User' on_change={on_change} />
              
              <FormNumberDefault error_object={error_object} form_object={form_object} is_integer={false} name={'amount'} placeholder='Amount' setErrorObject={set_error_object} setFormObject={set_form_object} validators={validators} id='amount' className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5' flag={{add_if_empty:false,allow_decimal:true,allow_zero_start:false,format_to_thousand:true,length_after_decimal:2}} label='Withdrawal Amount ($)' label_classname='mb-4' contentEditable={false} on_change={on_change} disabled={isSubmitting} />

              <FormTextFieldDefault 
                error_object={error_object} 
                form_object={form_object} 
                placeholder='Enter description'
                name='description'
                setErrorObject={set_error_object}
                setFormObject={set_form_object}
                validators={validators}
                className='w-full'
                field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5'
                id='description'
                label='Description'
                disabled={isSubmitting}
                label_classname='mb-4'
                />



              

              

            <Button
                variant="outline"
                className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer text-sm py-2 h-9"
                disabled={!is_form_valid}
                onClick={submit_form}
              >
                {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {isSubmitting ? 'Processing Withdrawal' : 'Withdraw'}
              </Button>

            </div>
            
            <CardTitle className="text-lg font-bold text-amber-300 mb-4">Withdrawal History</CardTitle>

            {withdrawal_state.length > 0 ? (
              <>
              <div className="hidden md:block overflow-x-auto">
                <Table className="text-gray-300">
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300 text-sm">Date</TableHead>
                      <TableHead className="text-gray-300 text-sm">Amount</TableHead>
                      {/*<TableHead className="text-gray-300 text-sm">Actions</TableHead>*/}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawal_state.map((tx) => (
                      <TableRow key={tx._id} className="border-gray-800 hover:bg-gray-700">
                        <TableCell className="text-sm">{extract_date_time(tx.createdAt, false)}</TableCell>
                        <TableCell className={`text-sm ${tx.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {NumberFormat.thousands(tx.amount, {
                            allow_decimal: true,
                            length_after_decimal: 2,
                            add_if_empty: true,
                            allow_zero_start: true,
                          })}
                        </TableCell>
                        
                        {/*<TableCell className="relative">
                          {tx.status < 1 && <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-300 hover:text-amber-300 cursor-pointer"
                            disabled={isSubmitting}
                            onClick={async () => {
                                await update_status(tx._id,tx.status+1);
                            }}
                            aria-label="More actions"
                          >
                            Update
                          </Button>}
                          
                        </TableCell>*/}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
        
              <div className="md:hidden space-y-3">
                {withdrawal_state.map((tx) => (
                  <Card key={tx._id} className="bg-gray-900 p-4 border border-gray-700 relative">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Date</span>
                        <span className="text-white text-sm">{extract_date_time(tx.createdAt, false)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Amount</span>
                        <span className={`text-sm ${tx.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {NumberFormat.thousands(tx.amount, {
                            allow_decimal: true,
                            length_after_decimal: 2,
                            add_if_empty: true,
                            allow_zero_start: true,
                          })}
                        </span>
                      </div>
                      {/*<div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Currency</span>
                        <span className="text-white text-sm">{tx.coin.toLocaleUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Crypto</span>
                        <span className="text-white text-sm">{tx.value_coin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Status</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tx.status === -1
                              ? 'bg-red-500/20 text-red-400'
                              : tx.status === 0
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {tx.status === -1 ? 'Awaiting Payment' : tx.status === 0 ? 'Awaiting Confirmation' : 'Payment Confirmed'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Last Updated</span>
                        <span className="text-white text-sm">{extract_date_time(tx.updatedAt, false)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Action</span>
                        {tx.status < 1 && <Button
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting}
                        className="text-gray-300 hover:text-amber-300 cursor-pointer"
                        onClick={async () => {
                            await update_status(tx._id,tx.status+1);
                        }}
                        aria-label="update status"
                      >
                        Update Status
                      </Button>}
                      </div>*/}
                    </div>
                    
                  </Card>
                ))}
              </div>
            </>
            ) : (
              <p className="text-center text-gray-400 text-sm">No deposits found.</p>
            )}
          </CardContent>
        </Card>

        {/* Crypto Info Cards */}
        
      </div>
    </SectionWrapper>
  );
};

export default WithdrawalPage;