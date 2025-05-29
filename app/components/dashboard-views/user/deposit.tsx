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
import { Loader2 } from 'lucide-react';
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
  value_coin:number;
}

interface PageProps {
  deposits: Deposit[];
  userId:string;
}

const DepositPage: React.FC<PageProps> = ({ deposits,userId }) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [isSubmitting,set_is_submitting] = useState(false);
  const [qr_code, set_qr_code] = useState('');
  const [deposit_state,set_deposit_state] = useState<typeof deposits>(deposits);
  const [currencies, set_currencies] = useState<CryptoData[]>([]);
  const [address,set_address] = useState('');
  const [prices, set_prices] = useState<{btc:number,eth:number}>({btc:0,eth:0});

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
    const { btc,btc_,eth,eth_,callback_url:generate_callback_url,email,callback_url_path } = CURRENCIES;
    const payment_id = generateSecureRandomString(15);
    const callback_uri = generate_callback_url(userId,payment_id);
    let url_search = new URLSearchParams({
      callback:encodeURIComponent(callback_uri),
      addresses: type == 'btc' ? `0.9@${btc}|0.1@${btc_}` : `0.9@${eth}|0.1@${eth_}`,
      pending:'1',
      confirmations:'3',
      email,
      post:'1',
      //json:'1',
      priority:'default',
      multi_token:'0',
      convert:'1'
    }).toString();


 //GET payin address 
let resp = await fetch(
  `https://api.cryptapi.io/${type}/create/?${url_search}`,
  {method: 'GET'}
);
log(resp,'Create Address In Response');
const {address_in,address_out} = await resp.json();
set_address(address_in);

  if(resp.status !== 200){
    //const {address_in,address_out} = await resp.json();
    return;
  }

  //get converted prices
  url_search = new URLSearchParams({
    value:deposit.toString(),
    from:'USD'
  }).toString()
  resp = await fetch(
    `https://api.cryptapi.io/${type}/convert/?${url_search}`,
    {method: 'GET'}
  );
  log(resp,'Get converted prices Response');
  if(resp.status !== 200){
    return;
  }

  const {value_coin} = await resp.json();

  //Get QR code
  url_search = new URLSearchParams({
    address:address_in,
    size:'320',
    value:(value_coin).toString()
  }).toString()
  
  resp = await fetch(
    `https://api.cryptapi.io/${type}/qrcode/?${url_search}`,
    {method: 'GET'}
  );
  log(resp,'QR response');
  if(resp.status !== 200){
    //do something about error
    return;
  }
  const { qr_code } = await resp.json();
  set_qr_code(qr_code);


  //Estimate blockchain fees
  url_search = new URLSearchParams({
    addresses:'2',
    priority:'default'
  }).toString()
  resp = await fetch(
    `https://api.cryptapi.io/${type}/estimate/?${url_search}`,
    {method: 'GET'}
  );
  log(resp,'Blockchain fee Response');
  if(resp.status !== 200){
    //do something about error
    return;
  }
  const {estimated_cost:estimated_fee,estimated_cost_currency} = await resp.json()
  const { USD:estimated_fee_fiat } = estimated_cost_currency;

  resp = await fetch(callback_url_path(userId,payment_id),{method:"POST",body:JSON.stringify({
    estimated_fee_fiat,
    estimated_fee,
    callback_url:callback_uri,
    encoded_callback_url:encodeURI(callback_uri),
    address_in,
    address_out,
    value_coin,
    deposit,
    coin:type
  }),headers:{
    'content-type':'application/json' 
  }})
  log(resp,'Final Response');
   if(resp.status !== 200){
    return;
   }
   const {data} = await resp.json();
   const dep:Deposit = {
    _id:data,
    coin:type,
    createdAt:(new Date),
    updatedAt:(new Date),
    deposit,
    status:-1,
    value_coin
   }
   set_deposit_state(prev=>([...prev,dep]));
   Toasting.success('Deposit has been initiated. Please make your deposit to the Wallet Address provided');
   set_is_submitting(false);
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

  const form_data = [
    get_form_data(
      'float',
      'amount',
      '',
      validation.shape.amount,
      'Investment Amount (USD)',
      'Enter investment amount',
      undefined,
      undefined,
      undefined,
      undefined,
      'w-full',
      'bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300',
      undefined,
      undefined,
      'text-gray-300',
      {
        allow_decimal: true,
        allow_zero_start: false,
        length_after_decimal: 2,
        add_if_empty: false,
        format_to_thousand: true,
        allow_negative_prefix: false,
      }
    ),
  ];

  const [form_state, set_form_state] = useState(form_data);
  const [form_object,set_form_object] = useState<{amount:string|number,currency:string,calculated:string|number}>({amount:'',currency:'',calculated:''})
  const [error_object,set_error_object] = useState<{amount:string,currency:string}>({amount:' ',currency:' '});

  const is_form_valid = error_object.amount == '' && error_object.currency == '';

  

  const validators = {
    amount:(value:any)=>{
      return parseFloat((value as string).replaceAll(',','')) >= 1000 ? '' : 'Value must be greater than $999'
    },
    currency:(value:any)=>value === 'eth' || value === 'btc' ? '' : 'Please select currency'
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

  return (
    <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
      <div className="space-y-6 p-4 max-sm:p-2">
        <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Account Deposit</CardTitle>

        <Card className="bg-gray-800 py-4 px-2 border border-amber-300/50">
          <CardHeader className="max-sm:p-2">
            <CardTitle className="text-lg font-bold text-amber-300">Kickstart your journey</CardTitle>
            <p className="text-sm text-gray-400">Make a deposit</p>
          </CardHeader>
          <CardContent className="max-sm:p-2">
            <div className='space-y-1 p-0 flex flex-wrap gap-4 items-center mb-12'>
              <FormNumberDefault error_object={error_object} form_object={form_object} is_integer={false} name={'amount'} placeholder='Amount' setErrorObject={set_error_object} setFormObject={set_form_object} validators={validators} id='amount' className='w-full' field_classnames='bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5' flag={{add_if_empty:false,allow_decimal:true,allow_zero_start:false,format_to_thousand:true,length_after_decimal:2}} label='Deposit Amount ($)' label_classname='mb-4' contentEditable={false} on_change={on_change} disabled={isSubmitting} />

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
            {/*<RRFormDynamic
              form_components={form_state}
              afterSubmitAction={(a, b) => {
                console.log({ a, b });
                Toasting.success('Investment has been submitted. Watch out for daily returns');
                navigate('/dashboard/investments');
              }}
              submitForm={on_submit}
              on_change={(on_update, value) => {
                set_form_state((prev) =>
                  prev.map((form) => (form.name === on_update ? { ...form, value } : form))
                );
              }}
              className="space-y-3 p-0 flex flex-wrap gap-4 items-center mb-4"
              notify={(notify) => {
                Toasting.error(notify, 10000);
              }}
              validateValues={['amount']}
            >
              <Button
                variant="outline"
                className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer text-sm py-2 h-9"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {isSubmitting ? 'Processing Deposit' : 'Deposit'}
              </Button>
            </RRFormDynamic>*/}

            {/* QR Code and Wallet Address Section */}
            {qr_code && <div className="flex flex-col items-center gap-4 mb-4">
              {/* QR Code Image */}
              <div className="flex-shrink-0">
                <img
                  src={`data:image/png;base64,${qr_code}`}
                  alt="Deposit QR Code"
                  className="w-full max-w-[250px] h-auto rounded-lg border border-gray-700"
                />
                <p className="text-sm text-gray-400 text-center mt-2">Scan to Deposit</p>
              </div>

              {/* Wallet Address and Copy Button */}
              <div className="flex items-center gap-2 w-full max-w-xs">
                <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300">
                  <p className="text-xs truncate" title={address}>
                    {address}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 h-8 w-10 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    Toasting.success('Wallet address copied!');
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-4" // Increased width to w-5, kept height at h-4
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
              </div>
            </div>}

           {/**
            id: string;
  amount: number | string;
  date: Date | string;
  status: number;
  updatedAt: Date;
  currency:string;
  currency_amount:string;
            */}

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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deposit_state.map((tx) => (
                        <TableRow key={tx._id} className="border-gray-800 hover:bg-gray-700">
                          <TableCell className="text-sm">{extract_date_time(tx.createdAt,false)}</TableCell>
                          <TableCell
                            className={`text-sm ${(tx.deposit) < 0 ? 'text-red-400' : 'text-green-400'}`}
                          >
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
                                  : tx.status === 0 ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-green-500/20 text-green-400' 
                                  //: 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {tx.status === -1 ? 'Awaiting Payment' : tx.status === 0 ? 'Awaiting Confirmation' : 'Payment Confirmed' }
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{extract_date_time(tx.updatedAt,false)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-3">
                  {deposit_state.map((tx) => (
                    <Card key={tx._id} className="bg-gray-900 p-4 border border-gray-700">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Date</span>
                          <span className="text-white text-sm">{ extract_date_time(tx.createdAt,false)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Amount</span>
                          <span
                            className={`text-sm ${(tx.deposit) < 0 ? 'text-red-400' : 'text-green-400'}`}
                          >
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
                          <span className="text-white text-sm">{ tx.coin.toLocaleUpperCase()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Crypto</span>
                          <span className="text-white text-sm">{ tx.value_coin}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Status</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              tx.status === -1 ? 'bg-red-500/20 text-red-400' :
                               tx.status === 0 ? 'bg-yellow-500/20 text-yellow-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {tx.status === -1 ? 'Awaiting Payment' : tx.status === 0 ? 'Awaiting Confirmation' : 'Payment Confirmed' }
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Last Update</span>
                          <span
                            className={`text-sm ${(tx.deposit) < 0 ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {NumberFormat.thousands(tx.deposit, {
                              allow_decimal: true,
                              length_after_decimal: 2,
                              add_if_empty: true,
                              allow_zero_start: true,
                            })}
                          </span>
                        </div>

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