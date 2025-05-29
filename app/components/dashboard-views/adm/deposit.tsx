import React, { useEffect, useState } from 'react';
import { useNavigation, useSubmit, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NumberFormat } from '@/components/number-field';
import { extract_date_time, generateSecureRandomString, log } from '@/lib/utils';
import { CURRENCIES } from '@/lib/config/crypt_api';
import { FormNumberDefault, FormSelectDefault, FormTextFieldDefault } from '@/components/form-components';


// Define schema for investment form
const investmentSchema = z.object({
  planId: z.string({ required_error: 'Please select a plan' }),
  amount: z.number({ required_error: 'Investment amount is required' }).positive({ message: 'Amount must be positive' }),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

export interface CryptoData {
  coin: string;
  fee_percent: string;
  logo: string;
  minimum_fee: number;
  minimum_fee_coin: string;
  minimum_transaction: number;
  minimum_transaction_coin: string;
  network_fee_estimation: string;
  prices: {
    [currency: string]: string;
  };
  prices_updated: string;
  ticker: string;
}

export interface Deposit {
  _id: string;
  deposit: number;
  createdAt: Date;
  status: number;
  updatedAt: Date;
  coin:string;
  user:{
    name:string;
    _id:string;
  }
  value_coin:number;
}

export interface Users {
    name:string;
    _id:string;
}

interface PageProps {
  deposits: Deposit[];
  userId:string;
  users:Users[]
}

const DepositPage: React.FC<PageProps> = ({ deposits,userId,users }) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [isSubmitting,set_is_submitting] = useState(false);
  const [qr_code, set_qr_code] = useState('');
  const [deposit_state,set_deposit_state] = useState<typeof deposits>(deposits);

  //log(deposit_state,'DEPOSIT STA');
  
  const [currencies, set_currencies] = useState<CryptoData[]>([]);
  const [address,set_address] = useState('');
  const [prices, set_prices] = useState<{btc:number,eth:number}>({btc:0,eth:0});

  const [users_state,set_users_state] = useState<Users[]>(users);
  let users_select = [{name:'Select user',value:'null'},...users_state.map((e)=>{
    return {
        name:e.name,
        value:e._id
    }
  })];

  

  log(users_select,'Users Select');

  useEffect(() => {
    const search = new URLSearchParams({
      address: 'string',
      value: '100',
      size: '512',
    });
    // Note: This useEffect seems incomplete; consider implementing QR code fetching logic if needed
  }, []);

  useEffect(() => {
    const run = async () => {
      const search = new URLSearchParams({ price: '1' }).toString();
      const fetch_data = await fetch(`https://api.cryptapi.io/info/?${search}`, { method: 'GET' });
      const data = await fetch_data.json();
      const { btc, eth, trc20 } = data;
      log(data, 'TCrypto DATA');
      const needed_data = Object.entries({ btc, eth, trc20 });
      set_prices({btc:parseFloat(btc.prices.USD),eth:parseFloat(eth.prices.USD)});
      const reduced_data = needed_data.reduce((acc, current) => {
        const [currency, currency_data] = current;
        if (currency === 'trc20') {
          const data: CryptoData = currency_data.usdt;
          return acc.concat([data]);
        } else {
          return acc.concat([currency_data as CryptoData]);
        }
      }, [] as CryptoData[]);
      set_currencies(reduced_data);
    };
    run();
  }, []);

  const process_deposit = async(type:'btc'|'eth',deposit:number)=>{
    set_is_submitting(true);
    try {
        const response = await fetch('/api/adm/deposit', {
            method:'POST',
            body: JSON.stringify({ 
                userId:form_object.user,
                value_coin:form_object.calculated,
                deposit,
                coin:type 
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
            
            Toasting.success('Deposit successful',5000);
            const dep:Deposit = {
                _id:data._id,
                coin:type,
                createdAt:(new Date),
                updatedAt:(new Date),
                deposit,
                status:-1,
                value_coin:parseFloat(form_object.calculated as string),
                user:{
                    name:(users_select.find(e=>e.value === form_object.user)?.name)!,
                    _id:form_object.user
                }
            }
            set_deposit_state(prev=>([...prev,dep]));
        }else{ 
                Toasting.success('Request failed to complete',5000);
        }
    } catch (error) {
        console.log(error);
        Toasting.error('A network error occured',5000);
        set_is_submitting(false);
    }
}

  const validation = z.object({
    amount: z.string().nonempty({ message: 'Enter the value change' }).refine(
      (e) => parseFloat(e.replaceAll(',', '')) >= 500,
      { message: 'Value must be a number greater than the lowest minimum investment amount' }
    ),
  });

  const investmentForm = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: undefined,
    },
    resetOptions: { keepDirtyValues: true, keepErrors: true },
  });

  const [form_object,set_form_object] = useState<{amount:string|number,user:string,currency:string,calculated:string|number}>({amount:'',currency:'',calculated:'',user:''})
  const [error_object,set_error_object] = useState<{amount:string,currency:string,user:string}>({amount:' ',currency:' ',user:' '});

  const is_form_valid = error_object.amount == '' && error_object.currency == '';

  

  const validators = {
    amount:(value:any)=>{
      return parseFloat((value as string).replaceAll(',','')) >= 1000 ? '' : 'Value must be greater than $999'
    },
    currency:(value:any)=>value === 'eth' || value === 'btc' ? '' : 'Please select currency',
    user:(value:any)=>value.trim() !== 'null' || value.trim() !== '' ? '' : 'Please select user',
  }

  const validate_form = ()=>{
    let check = true;
    const validates = Object.entries(error_object).forEach(([name,value])=>{
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
    await process_deposit(form_object.currency as 'eth' | 'btc',parseFloat((form_object.amount as string).replaceAll(',','')));
  }

  const update_status = async (id:string,status:number) =>{
    const dep = deposit_state.find(e=>e._id === id);
    //dep.
    set_is_submitting(true);
    try {
        const response = await fetch('/api/adm/deposit', {
            method:'PATCH',
            body: JSON.stringify({ 
                id,
                status,
                userId:dep?.user._id
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
            
            Toasting.success('Deposit update successful',5000);
           /* const dep:Deposit = {
                _id:data._id,
                coin:type,
                createdAt:(new Date),
                updatedAt:(new Date),
                deposit,
                status:-1,
                value_coin:parseFloat(form_object.calculated as string),
                userId:{
                    name:(users_select.find(e=>e.value === form_object.user)?.name)!,
                    _id:form_object.user
                }
            }*/
            set_deposit_state(prev=>prev.map(e=>e._id === id ? {...e,updatedAt:(new Date),status}: e));
            //set_deposit_state(prev=>([...prev,dep]));
        }else{ 
                Toasting.success('Request failed to complete',5000);
        }
    } catch (error) {
        console.log(error);
        Toasting.error('A network error occured',5000);
        set_is_submitting(false);
    }
  }

  const on_change = (value:any,name:keyof typeof form_object)=>{
    if(name === 'amount'){
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
    }
  }

  const on_submit = async (form_values: any) => {
    submit(Object.assign({}, form_values, {}), {
      action: '/dashboard/subscribe',
      encType: 'application/json',
      method: 'POST',
      replace: true,
    });
  };

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
      <div className="space-y-6 p-4 max-sm:p-2">
        <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Account Deposit</CardTitle>

        <Card className="bg-gray-800 py-4 px-2 border border-amber-300/50">
          <CardHeader className="max-sm:p-2">
            <CardTitle className="text-lg font-bold text-amber-300">Create Deposit</CardTitle>
            <p className="text-sm text-gray-400">Make a deposit</p>
          </CardHeader>
          <CardContent className="max-sm:p-2">
            <div className='space-y-1 p-0 flex flex-wrap gap-4 items-center mb-12'>
              <FormNumberDefault error_object={error_object} form_object={form_object} is_integer={false} name={'amount'} placeholder='Amount' setErrorObject={set_error_object} setFormObject={set_form_object} validators={validators} id='amount' className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5' flag={{add_if_empty:false,allow_decimal:true,allow_zero_start:false,format_to_thousand:true,length_after_decimal:2}} label='Deposit Amount ($)' label_classname='mb-4' contentEditable={false} on_change={on_change} disabled={isSubmitting} />

              <FormSelectDefault name='user' error_object={error_object} form_object={form_object} placeholder='Select user' selects={users_select} set_error_object={set_error_object} set_form_object={set_form_object} validators={validators} className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2' id='currency' label='User' on_change={on_change} />

              <FormSelectDefault name='currency' error_object={error_object} form_object={form_object} placeholder='Select currency' selects={[
                {
                name:'Select currency',
                value:'null'
                },
                {
                  name:'Bitcoin',
                  value:'btc'
                },
                {
                  name:'Ethereum',
                  value:'eth'
                }
              ]} set_error_object={set_error_object} set_form_object={set_form_object} validators={validators} className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2' id='currency' label='Currency' on_change={on_change} />

<FormNumberDefault error_object={error_object} form_object={form_object} is_integer={false} name={'calculated'} placeholder='Calculated crypto amount' setErrorObject={set_error_object} setFormObject={set_form_object} validators={validators} id='amount' className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5' label={`Amount in ${form_object.currency && form_object.currency !== 'null' ? form_object.currency.toLocaleUpperCase() : 'Crypto'}`} label_classname='mb-4' contentEditable={false} disabled={true} unformat={true} flag={{add_if_empty:false,allow_decimal:true,allow_zero_start:true,format_to_thousand:false}}  />

            <Button
                variant="outline"
                className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer text-sm py-2 h-9"
                disabled={!is_form_valid}
                onClick={submit_form}
              >
                {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {isSubmitting ? 'Processing Deposit' : 'Deposit'}
              </Button>

            </div>
            
            <CardTitle className="text-lg font-bold text-amber-300 mb-4">Deposit History</CardTitle>

            {deposit_state.length > 0 ? (
              <>
              <div className="hidden md:block overflow-x-auto">
                <Table className="text-gray-300">
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300 text-sm">Date</TableHead>
                      <TableHead className="text-gray-300 text-sm">Amount</TableHead>
                      <TableHead className="text-gray-300 text-sm">Currency</TableHead>
                      <TableHead className="text-gray-300 text-sm">Crypto</TableHead>
                      <TableHead className="text-gray-300 text-sm">Status</TableHead>
                      <TableHead className="text-gray-300 text-sm">Last Updated</TableHead>
                      <TableHead className="text-gray-300 text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposit_state.map((tx) => (
                      <TableRow key={tx._id} className="border-gray-800 hover:bg-gray-700">
                        <TableCell className="text-sm">{extract_date_time(tx.createdAt, false)}</TableCell>
                        <TableCell className={`text-sm ${tx.deposit < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {NumberFormat.thousands(tx.deposit, {
                            allow_decimal: true,
                            length_after_decimal: 2,
                            add_if_empty: true,
                            allow_zero_start: true,
                          })}
                        </TableCell>
                        <TableCell className="text-sm">{tx.coin.toLocaleUpperCase()}</TableCell>
                        <TableCell className="text-sm">{tx.value_coin}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-sm">{extract_date_time(tx.updatedAt, false)}</TableCell>
                        <TableCell className="relative">
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
                            Update Status
                          </Button>}
                          
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
        
              <div className="md:hidden space-y-3">
                {deposit_state.map((tx) => (
                  <Card key={tx._id} className="bg-gray-900 p-4 border border-gray-700 relative">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Date</span>
                        <span className="text-white text-sm">{extract_date_time(tx.createdAt, false)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Amount</span>
                        <span className={`text-sm ${tx.deposit < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {NumberFormat.thousands(tx.deposit, {
                            allow_decimal: true,
                            length_after_decimal: 2,
                            add_if_empty: true,
                            allow_zero_start: true,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
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
                      </div>
                    </div>
                    {/*<div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-amber-300"
                        onClick={() => toggleDropdown(tx._id)}
                        aria-label="More actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {dropdownOpen === tx._id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-10">
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 text-sm"
                            onClick={() =>null
                            }
                          >
                            Update Status
                          </button>
                        </div>
                      )}
                    </div>*/}
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
        <Card className="bg-gray-800 border border-amber-300/50 p-4 space-y-4">
          {currencies.map((cryptoData) => (
            <Card key={cryptoData.ticker} className="bg-gray-800 border border-gray-700">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  <img
                    src={cryptoData.logo}
                    alt={`${cryptoData.coin} logo`}
                    className="w-6 h-6 rounded-full"
                  />
                  {cryptoData.coin} ({cryptoData.ticker.toUpperCase()})
                </CardTitle>
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(cryptoData.prices_updated).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Current Prices</h3>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                    {Object.entries(cryptoData.prices)
                      .filter((e) => e[0] === 'USD' || e[0] === 'EUR' || e[0] === 'GBP' || e[0] === 'NGN')
                      .map(([currency, price]) => (
                        <div key={currency} className="flex justify-between py-1.5">
                          <span className="text-gray-300 text-sm">{currency}</span>
                          <span className="text-white font-medium text-sm">
                            {NumberFormat.thousands(price, {
                              allow_decimal: true,
                              length_after_decimal: 2,
                              add_if_empty: true,
                              allow_zero_start: true,
                            })}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default DepositPage;