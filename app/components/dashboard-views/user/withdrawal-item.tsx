import React, { useState } from 'react';
import { useParams, useNavigation, useSubmit, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { NumberFormat } from '@/components/number-field';
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2 } from 'lucide-react';
import { log } from '@/lib/utils';
//import { redirect } from 'react-router';

// Define schemas for the withdrawal form




// Define interface for wallet addresses
interface WalletAddress {
    name:string;
    value:string;
    
}

export interface InvestmentInfo {
    //_id:string;
    invested:number;
    max_withdrawal:number;
    isWithdrawal:boolean;
    plan:{
        name:string,
        dailyReturn:number,
        duration:number,
        minInvestment:number
    };
    isActive:boolean;
}

interface PageProps {
    userWallets:WalletAddress[];
    investmentDetails:InvestmentInfo;
}

// Loader to fetch specific investment details and user's wallet addresses


// Action to handle the withdrawal form submission 


const WithdrawFormPage: React.FC<PageProps> = ({investmentDetails,userWallets}) => {
    //const { investmentDetails, userWallets } = useLoaderData<typeof loader>();
    //const [is_loaded,set_is_loaded] = useState(false);
    
    const submit = useSubmit();
    const navigate = useNavigate();
    const max_withdrawal = NumberFormat.thousands(investmentDetails.max_withdrawal.toFixed(2),{add_if_empty:true,allow_decimal:true,allow_zero_start:true,length_after_decimal:2});
    const { investment_id } = useParams(); // Get the investment ID from URL
   ///  const actionData = useActionData<typeof action>();
     const navigation = useNavigation();
     const isSubmitting = navigation.state === 'submitting';
    

     const withdrawalFormSchema = z.object({
        //investmentId: z.string(), // Hidden field
        amount: z.string().min(1, { message: 'Please enter the withdrawal amount' })/*.positive({ message: 'Amount must be positive' }).max(investmentDetails.max_withdrawal{message:`Value cannot be greater than ypur ROI + investment amount ($${max_withdrawal})`})*/.refine((e)=>{
            let amount = parseFloat(e.replaceAll(',',''));
            //console.log(e);
            //console.log(investmentDetails.max_withdrawal);
            //console.log(amount <= investmentDetails.max_withdrawal);
            //console.log(amount);
            return amount > 0 && amount <= investmentDetails.max_withdrawal ? true : false; 
            //return true;
        },{message:`Value cannot be greater than your ROI + investment amount ($${max_withdrawal})`}),
        currency: z.string().min(1, { message: 'Please select a wallet address' }),
      });


    const { amount,currency } = withdrawalFormSchema.shape;
    const form_data = [
        get_form_data('select','currency','',currency,'Wallet Address','Please select your wallet address',undefined,undefined,undefined,userWallets,'w-full','bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300'),
        get_form_data('float','amount','',amount,'Withdrawal Amount (USD)','Please enter withdrawal amount',undefined,undefined,undefined,undefined,'w-full','bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300',undefined,undefined,'text-gray-300',{allow_decimal:true,allow_zero_start:false,length_after_decimal:2,add_if_empty:false,format_to_thousand:true,allow_negative_prefix:false}),
        //get_form_data('text','label','',amount,'Label','e.g, My Bitcoin Wallet',undefined,undefined,undefined,undefined,'w-full','bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300'),
    ];

    const [form_state,set_form_state] = useState(form_data);
    const on_change_form = (name:string|number|Symbol,value:any)=>{
        set_form_state(prev=>prev.map(e=>(e.name == name ? {...e,value} : e)));
    }

    const on_submit_form = async (form_value:any) =>{
        submit(form_value,{action:`/dashboard/withdrawal/request/${investment_id}`,encType:'application/json',method:'POST',replace:true});
    }

    const after_submit_action = async (message:string,data:any)=>{
        Toasting.success('Your withdrawal request has been sent',10000);
        navigate(`/dashboard/withdrawal`);
    }

     // Reset form and potentially redirect on successful action submission
     /*React.useEffect(() => {
         if (actionData?.message) {
             withdrawalForm.reset({ investmentId: investmentId, amount: undefined, walletAddressId: '' });
             console.log('Withdrawal Success:', actionData.message);
             
         }
         if (actionData?.error) {
            console.error('Withdrawal Error:', actionData.error);
         }
     }, [actionData, withdrawalForm]);*/
     
     //if(!is_loaded)
        //return null
    

  return (
    <SectionWrapper animationType='fadeInUp' padding='4' md_padding='4'>
    <div className="space-y-8">
      <h1 className="text-2xl md:text-4xl font-medium text-amber-300 mb-6">Withdraw from {investmentDetails.plan.name || 'Account'}</h1>

       <Card className="bg-gray-800 p-6 border border-amber-300/50 max-w-lg mx-auto">
         <CardHeader>
           <CardTitle className="text-xl font-bold text-amber-300">Withdrawal Details</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
             <p className="text-gray-300"><span className="font-semibold">Invested Amount:</span> <span className='text-amber-300 font-medium'>${ NumberFormat.thousands (investmentDetails.invested.toFixed(2),{add_if_empty:true,allow_decimal:true,allow_zero_start:true,length_after_decimal:2})}</span></p>
              <p className="text-gray-300"><span className="font-semibold">Amount Available for Withdrawal:</span> <span className="text-amber-300 font-medium">${max_withdrawal}</span></p>

              <RRFormDynamic
                    validateValues={['amount','currency']}
                    afterSubmitAction={after_submit_action}
                    on_change={on_change_form}
                    submitForm={on_submit_form}
                    form_components={form_state}
                    className="space-y-6 p-0 md:p-0 flex flex-wrap gap-4 items-center"
                    notify={(notify)=>{
                        Toasting.error(notify,10000);
                    }}

               >
                <Button type="submit" className="w-full bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting || userWallets.length === 0 || investmentDetails.max_withdrawal <= 0 || investmentDetails.isActive || investmentDetails.isWithdrawal }>
                        {isSubmitting && <Loader2 className="animate-spin" />}
                        {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                   </Button>

              </RRFormDynamic>

              
         </CardContent>
       </Card>

       {/*actionData?.message && !actionData.error && (
           <div className="mt-8 p-4 bg-green-500/20 text-green-400 rounded-md text-center max-w-lg mx-auto">
               {actionData.message}
           </div>
       )*/}

    </div>
</SectionWrapper>
  );
};

export default WithdrawFormPage;