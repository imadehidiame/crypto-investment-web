// app/routes/dashboard.subscribe.tsx
import React, { useState } from 'react';
import { useLoaderData, Form, useActionData, useNavigation, useSubmit, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2 } from 'lucide-react';
import { NumberFormat } from '@/components/number-field';

// Define schema for investment form
const investmentSchema = z.object({
  planId: z.string({ required_error: 'Please select a plan' }), // Hidden input or passed via state/params
  amount: z.number({ required_error: 'Investment amount is required' }).positive({ message: 'Amount must be positive' }),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

export interface Subscription {
        id: string;
        name: string;
        minInvestment: number|string;
        maxInvestment: number|string;
        duration: number;
        dailyReturn: number;
}
interface PageProps {
    plans:SubscriptionData;
    initialSelectedPlan: Subscription|null;
    balance: number;
    account_info:{
      earnings:number,
      investments:number
    }
}
export type SubscriptionData = Subscription[];



const SubscribePage: React.FC<PageProps> = ({plans,initialSelectedPlan,balance,account_info}) => {
    //const {  plans, initialSelectedPlan } = useLoaderData<typeof loader>();
     //const actionData = useActionData<typeof action>();
     const navigation = useNavigation();
     const navigate = useNavigate();
     const submit = useSubmit();
     const isSubmitting = navigation.state === 'submitting';
     console.log('Balance ',balance)
    const [account_data] = useState<{balance:string,investments:string,investable:string}>({
      balance:NumberFormat.thousands(account_info.earnings,{add_if_empty:true,allow_decimal:true,allow_zero_start:true,length_after_decimal:2}),
      investments:NumberFormat.thousands(account_info.investments,{add_if_empty:true,allow_decimal:true,allow_zero_start:true,length_after_decimal:2}),
      investable:NumberFormat.thousands(account_info.earnings - account_info.investments,{add_if_empty:true,allow_decimal:true,allow_zero_start:true,length_after_decimal:2})
      }
    )

    const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(initialSelectedPlan);

    const validation = z.object({
        amount:z.string().nonempty({message:'Enter the amount you would like to invest'}).refine((e)=>{
                return plans.length > 0 ? parseFloat(e.replaceAll(',','')) >= parseFloat((plans[0].minInvestment as string).replaceAll(',','')) :  parseFloat(e) > 0;
                //return false;
            },{message:'Value must be a number greater than the lowest minimum investment amount and less than or equal to your investable balance of $'+ NumberFormat.thousands(balance,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:true})}),
    });

    const investmentForm = useForm<InvestmentFormValues>({
      resolver: zodResolver(investmentSchema),
      defaultValues: {
        planId: selectedPlan?.id,
        amount: undefined,
      },
       resetOptions: { keepDirtyValues: true, keepErrors: true },
    });

    // Update form default value when selectedPlan changes
    React.useEffect(() => {
        if (selectedPlan) {
            //investmentForm.setValue('planId', selectedPlan.id);
             // Optionally set amount if needed, or clear it
             //investmentForm.setValue('amount', 0);
        }
    }, [selectedPlan, investmentForm]);

     // Reset form on successful action submission
     const form_data = [get_form_data('float','amount','',validation.shape.amount,'Investment Amount (USD)','Enter investment amount',undefined,undefined,undefined,undefined,'w-full','bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300',undefined,undefined,'text-gray-300',{allow_decimal:true,allow_zero_start:false,length_after_decimal:2,add_if_empty:false,format_to_thousand:true,allow_negative_prefix:false})];

     const [form_state,set_form_state] = useState(form_data); 

     const on_submit = async (form_values:any)=>{
        const {duration,name:plan_name,id:plan,dailyReturn}  = selectedPlan!;
        submit(Object.assign({},form_values,{duration,plan_name,plan,dailyReturn}),{action:'/dashboard/subscribe',encType:'application/json',method:'POST',replace:true});
     }

  return (
    <SectionWrapper animationType='slideInRight' padding='0' md_padding='0'>
    <div className="space-y-8 p-6">
      {/*<h1 className="text-3xl md:text-4xl font-medium text-amber-300">Subscribe to a Plan</h1>*/}
      <CardTitle className="text-2xl font-medium text-amber-300">Subscribe to a Plan</CardTitle>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card
             key={plan.id}
             className={`bg-gray-800 p-6 border ${selectedPlan?.id === plan.id ? 'border-amber-300' : 'border-amber-300/50'} cursor-pointer hover:border-amber-300 transition-colors duration-300 flex flex-col justify-between`}
             onClick={() => setSelectedPlan(plan)}
           >
             <div>
                 <h2 className="text-xl font-semibold mb-2 text-amber-300">{plan.name}</h2>
                 <p className="text-gray-300 mb-2">
                   <span className="font-medium">Investment Range:</span> <span className='text-amber-300'>${plan.minInvestment} - ${plan.maxInvestment}</span>
                 </p>
                 <p className="text-gray-300 mb-2">
                   <span className="font-medium">Duration:</span> <span className='text-amber-300'>{plan.duration}</span>
                 </p>
                 <p className="text-gray-300 mb-4">
                   <span className="font-medium">Daily Return:</span> <span className='text-amber-300'>{plan.dailyReturn+'%'}</span>
                 </p>
             </div>
             {selectedPlan?.id === plan.id && (
                <div className="mt-4 text-sm font-semibold text-amber-300">Selected</div>
             )}
           </Card>
        ))}
      </div>

      {/* Investment Form */}
      {selectedPlan && (
        <Card className="bg-gray-800 p-6 border border-amber-300/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-300">Invest in {selectedPlan.name}</CardTitle>
             <p className="text-sm text-gray-50">Investment Range: ${selectedPlan.minInvestment} - ${selectedPlan.maxInvestment}</p>
             <p className="text-sm text-gray-400">Total Investable Balance: <span className='text-amber-300'>${account_data.balance}</span></p>
             <p className="text-sm text-gray-400">Running Investments: <span className='text-amber-300'>${account_data.investments}</span></p>
             <p className="text-sm text-gray-400">Current Investable Balance: <span className='text-amber-300'>${account_data.investable}</span></p>
          </CardHeader>
          <CardContent>

            <RRFormDynamic
                                        form_components={form_state}
                                        afterSubmitAction={(a,b)=>{
                                            console.log({a,b});
                                            Toasting.success('Investment has been submitted. Watch out for daily returns');
                                            navigate('/dashboard/investments');
                                        }}
                                        redefine={({ amount }) => {
                                        let { minInvestment,maxInvestment } = selectedPlan;
                                        const mod_amount = parseFloat((amount as string).replaceAll(',',''));
                                        let mod_minInvestment = parseFloat((minInvestment as string).replaceAll(',',''));
                                        let mod_maxInvestment = parseFloat((maxInvestment as string).replaceAll(',',''));
                                        const check = mod_amount >= mod_minInvestment && mod_amount <= mod_maxInvestment && mod_amount <= balance;
                                        console.log(check);
                                        if(balance <= 0)
                                          return { error: 'Unfortunately you are running low on investable balance. You will have make a deposit on your account first before investing', valid: false, path: 'amount' };
                                          //const match = password.trim() === confirmPassword.trim();
                                              return { error: check ? '' : `Investment amount must be between ${minInvestment} and ${maxInvestment} and also a value not greater than your current investable balance of $${NumberFormat.thousands(balance,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:true})}`, valid: check, path: 'amount' };
                                          
                                      }}
                                        submitForm={on_submit}
                                        on_change={(on_update,value)=>{
                                          set_form_state(prev=>prev.map(form=>(form.name === on_update ? {...form,value} : form)));
                                        }}
                                        className="space-y-6 p-0 md:p-0 flex flex-wrap gap-4 items-center"
                                        notify={(notify)=>{
                                          Toasting.error(notify,10000);
                                        }}
                                        validateValues={['amount']}
                          
                                      >
                          
                                          
                                             
                                              <Button variant="outline" className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer" disabled={isSubmitting}>
                                                {isSubmitting && <Loader2 className="animate-spin" />}
                                                {isSubmitting ? 'Investing' : 'Confirm Investment'}
                                              </Button>
                                               
                                          
                          
                            </RRFormDynamic>


             {/*<ShadcnForm {...investmentForm}>
                <Form method="post" onSubmit={investmentForm.handleSubmit((values) =>  })} className="space-y-6">
                   
                   <input type="hidden" {...investmentForm.register('planId', { valueAsNumber: true })} name="planId" />

                    <FormField
                        control={investmentForm.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Investment Amount (USD)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="any" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="amount"
                                        onChange={event => field.onChange(parseFloat(event.target.value))} // Ensure value is number
                                        min={selectedPlan.minInvestment} // Add min/max validation based on plan
                                        max={selectedPlan.maxInvestment}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                   
                    <Button type="submit" className="bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting}>
                        {isSubmitting ? 'Investing...' : 'Confirm Investment'}
                   </Button>
                     
                </Form>
            </ShadcnForm>*/}
          </CardContent>
        </Card>
      )}
       
    </div>
    </SectionWrapper>
  );
};

export default SubscribePage;