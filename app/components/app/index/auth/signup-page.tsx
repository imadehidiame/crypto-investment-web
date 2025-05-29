// pages/AuthPage.tsx
import React, { useState } from 'react';
//import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { useNavigate, useNavigation, useSubmit } from 'react-router';
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2 } from 'lucide-react';
// You'll need to install zod and @hookform/resolvers

// Define schemas for validation
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, { message: 'Email or Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Please enter your name' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Confirm Password is required' }),
  //agreeTerms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;


const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';
  const { name,email,password,confirmPassword } = signupSchema._def.schema.shape  
  const submit = useSubmit();
  const form_data = [
    get_form_data('text','name','',name,'Full Name','Full name',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300 mt-2'),
    get_form_data('text','email','',email,'Email Address','Email address',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300 mt-2'),
    get_form_data('password','password','',password,'Password','Login password',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300 mt-2'),
    get_form_data('password','confirmPassword','',confirmPassword,'Confirm Password','Confirm password',undefined,undefined,undefined,undefined,'w-full','border-amber-300 text-white focus:border-amber-300 mt-2'),
  ];
  
  const [form_state,set_form_state] = useState(form_data);

  // React Hook Form setup for Signup
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      //agreeTerms: false,
    },
  });


  

  const handleSignupSubmit = (values: SignupFormValues) => {
    //console.log('Signup submitted:', values);
    // Implement your signup logic here (API call, user creation)
    // Redirect to login or dashboard on success
  };

  const on_submit = async (form_values:any)=>{
    //const form_sub = form_data.filter(e=>e.name !== undefined).reduce((prev,{name,value})=>({...prev,[name!]:value}),{});
    submit(form_values,{
      action:'/auth/signup',
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
              Sign Up for CoinInvest
            </CardTitle>
          </CardHeader>
          <CardContent>
            
              <RRFormDynamic
                            form_components={form_state}
                            afterSubmitAction={()=>{
              
                            }}
                            redefine={({ password, confirmPassword }) => {
                              const match = password.trim() === confirmPassword.trim();
                                  return { error: match ? '' : 'Passwords do not match', valid: match, path: 'confirmPassword' };
                              
                          }}
                            submitForm={on_submit}
                            on_change={(on_update,value)=>{
                              set_form_state(prev=>prev.map(form=>(form.name === on_update ? {...form,value} : form)));
                            }}
                            className="space-y-4 p-0 md:p-0 flex flex-wrap gap-4 items-center"
                            notify={(notify)=>{
                              Toasting.error(notify,10000);
                            }}
                            validateValues={['name', 'password','email','confirmPassword']}
              
                          >
              
                              
                                 
                                  <Button variant="outline" className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer">
                                    {loading && <Loader2 className="animate-spin" />}
                                    {loading ? 'Checking' : 'Sign up'}
                                  </Button>
                                   
                              
              
                </RRFormDynamic>
            
              
               

            {/* Toggle between Login and Signup */}
            <div className="mt-6 text-center text-gray-300">
              
                <p>
                  Already have an account?{' '}
                  <button onClick={() => navigate('/auth')} className="text-gold-500 hover:underline focus:outline-none">
                    Login
                  </button>
                </p>
              
            </div>
          </CardContent>
        </Card>
      </section>
    </SectionWrapper>
  );
};

export default SignupPage;