// pages/AuthPage.tsx
import React, { useEffect, useState } from 'react';
//import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { useNavigate, useNavigation, useSubmit } from 'react-router';
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import { log } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
// You'll need to install zod and @hookform/resolvers

// Define schemas for validation
export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Please enter your registered email address' }).email({message:'Please enter a valid email address'}),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

/*const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Confirm Password is required' }),
  agreeTerms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});*/

const LoginPage: React.FC = () => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';
  const [search,set_search] = useState<string|null>('');
  useEffect(()=>{
    set_search(new URLSearchParams(location.search).get('no_route'))
    //log(new URLSearchParams(location.search).get('no_routeee'),'Location Path');
  },[]);
  
  
  const { username,password } = loginSchema.shape;

  const form_data = [
    get_form_data('text','username','',username,'Email Address','Email Address',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300'),
    get_form_data('password','password','',password,'Password','Password',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300')
  ];

  const [form_state,set_form_state] = useState(form_data);
  
  const on_submit = async (form_values:any)=>{
    //log(form_values,'Form values')
    //const form_sub = form_data.filter(e=>e.name !== undefined).reduce((prev,{name,value})=>({...prev,[name!]:value}),{});
    submit(form_values,{
      action:'/auth'+search ? '?no_route=1' : '',
      encType:'application/json',
      method:'POST',
      replace:true,
    });
  }
  

  return (
    <SectionWrapper>
      <section className="py-2 flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md text-white border border-amber-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-300">
               Login to CoinInvest 
            </CardTitle>
          </CardHeader>
          <CardContent>

            <RRFormDynamic
              form_components={form_state}
              afterSubmitAction={()=>{

              }}
              submitForm={on_submit}
              on_change={(on_update,value)=>{
                set_form_state(prev=>prev.map(form=>(form.name === on_update ? {...form,value} : form)));
              }}
              className="space-y-4 p-0 md:p-0 flex flex-wrap gap-4 items-center justify-between"
              notify={(notify)=>{
                Toasting.error(notify,10000);
              }}
              validateValues={['username', 'password']}

            >

                
                   <a href="#" className="text-gold-500 mt-3 hover:underline">Forgot Password?</a>
                    <Button variant="outline" className="border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer">
                      
                      {loading && <Loader2 className="animate-spin" />}
                      {loading ? 'Checking' : 'Login'}
                    </Button>
                     
                

            </RRFormDynamic>
            
            <div className="mt-6 text-center text-gray-300">
              
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => navigate('/auth/signup')} className="text-gold-500 hover:underline focus:outline-none">
                    Sign Up
                  </button>
                </p>
              
            </div>
          </CardContent>
        </Card>
      </section>
    </SectionWrapper>
  );
};

export default LoginPage;