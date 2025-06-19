import React, { useEffect, useState } from 'react';
import { useLoaderData, Form, useActionData, useNavigation, useSubmit, type SubmitTarget } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UserData } from '@/lib/config/session';
import SectionWrapper from '@/components/shared/section-wrapper';
import { log } from '@/lib/utils';
import { Toasting } from '@/components/loader/loading-anime';
//import { getAuthenticatedUser } from '../auth.server'; // Import server-side auth function




const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  user_password: z.string().min(1, { message: 'Please enter current password to update' }),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Your new password must be at least 8 characters' }),
  confirmNewPassword: z.string().min(1, { message: 'Please re-enter your password' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});


type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PageProps {
  user:UserData
}

type ActionData = {
    error?:string;
    formType?:string;
    message?:string
} | null


const DashboardProfile: React.FC<PageProps> = ({user}) => {
    //const { user } = useLoaderData<typeof loader>();
     const actionData = useActionData();
     const navigation = useNavigation();
     const isSubmitting = navigation.state === 'submitting';
     const submit = useSubmit();
     const json_action = useState<ActionData>(null);

     

   
   const profileForm = useForm<ProfileFormValues>({
     resolver: zodResolver(profileSchema),
     defaultValues: {
       name: user?.name || '',
       email: user?.email || '',
       user_password:''
     },
     mode:'all',
     resetOptions: {
           keepDirtyValues: true, 
           keepErrors: true,
       },
   });

   
    const passwordChangeForm = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },

        mode:'onChange',
         
          resetOptions: {
              keepDirtyValues: true,
              keepErrors: true,
          },
    });

    // Reset forms on successful action submission
    React.useEffect(() => {
        // {"formType":"updateProfile","name":"Ehidiamen Imadegbo","email":"imadehidiame@gmail.com"}
        if(actionData){
        //const json_action_data = JSON.parse(actionData);
        //console.log({actionData:json_action_data});
        if(actionData?.error){
            console.log(actionData?.error);
            Toasting.error(actionData.error,10000,'top-center');
        }else{ 
        if (actionData?.message) {
            //profileForm.reset(profileForm.getValues()); 
            Toasting.success(actionData.message,10000,'top-center');
        }
        if (actionData?.formType === 'changePassword' && actionData?.message) {
            passwordChangeForm.reset(); // Clear password fields
            
        }
         if (actionData?.error) {
             console.error('Profile Action Error:', actionData.error);
         }
        }
     }
        
    }, [actionData, profileForm, passwordChangeForm]);

    useEffect(()=>{
        //console.log(navigation.formData);
        //console.log(navigation.formAction);
        //console.log(navigation.location);
        console.log(navigation.formData?.get('formType'))
    },[navigation.formData]);

  return (
    <SectionWrapper animationType='slideInLeft' padding='4' md_padding='4'>
    <div className="space-y-8">
      {/*<h1 className="text-3xl md:text-4xl font-bold text-amber-300">My Profile</h1>*/}
      <CardTitle className="text-3xl font-medium text-amber-300">My Profile</CardTitle>

      {/* Profile Information Card */}
      <Card className="bg-gray-800 p-6 border border-amber-300/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-300">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
            <ShadcnForm {...profileForm}>
                 <Form method="post"
                    action="/dashboard/profile"
                    encType='application/x-www-form-urlencoded' 
                 
                  onSubmit={(e)=>{
                    if(profileForm.formState.errors.email || profileForm.formState.errors.user_password || profileForm.formState.errors.name){
                        e.preventDefault();
                    }
                  }}
                  className="space-y-6">
                     <input type="hidden" name="formType" value="updateProfile" />
                    <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Full Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={profileForm.control}
                        name="user_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="user_password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     
                   
                    <Button type="submit" className="bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting}>
                        {isSubmitting && navigation.formData?.get('formType') === 'updateProfile'  ? 'Saving...' : 'Save Changes'}
                   </Button>
                    {/*actionData?.formType === 'updateProfile' && navigation.state !=='submitting' && actionData?.error && (
                       <p className="text-red-500 mt-4">{actionData.error}</p>
                    )*/}
                     {/*actionData?.formType === 'updateProfile' && actionData?.message && (
                        <p className="text-green-500 mt-4">{actionData.message}</p>
                     )*/}
                 </Form>
            </ShadcnForm>
        </CardContent>
      </Card>

      {/* Change Password Card */}
       <Card className="bg-gray-800 p-6 border border-amber-300/50">
         <CardHeader>
           <CardTitle className="text-xl font-bold text-amber-300">Change Password</CardTitle>
         </CardHeader>
         <CardContent>
            <ShadcnForm {...passwordChangeForm}>
                <Form method="post" action='/dashboard/profile' onSubmit={(e)=>{
                    if(passwordChangeForm.formState.errors.confirmNewPassword || passwordChangeForm.formState.errors.currentPassword || passwordChangeForm.formState.errors.newPassword){
                        e.preventDefault();
                    }
                }} className="space-y-6">
                    <input type="hidden" name="formType" value="changePassword" />
                   <FormField
                        control={passwordChangeForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="currentPassword" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={passwordChangeForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="newPassword" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                      <FormField
                        control={passwordChangeForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300" {...field} name="confirmNewPassword" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                   <Button type="submit" className="bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting}>
                       {isSubmitting && navigation.formData?.get('formType') === 'changePassword' ? 'Changing...' : 'Change Password'}
                   </Button>
                     {/*actionData && actionData?.formType === 'changePassword' && actionData?.error && (
                       <p className="text-red-500 mt-4">{actionData.error}</p>
                    )*/}
                     {/*actionData?.formType === 'changePassword' && actionData?.message && (
                        <p className="text-green-500 mt-4">{actionData.message}</p>
                     )*/}
                </Form>
            </ShadcnForm>
         </CardContent>
       </Card>
    </div>
    </SectionWrapper>
  );
};

export default DashboardProfile;