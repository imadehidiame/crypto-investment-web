import React from 'react';
import { useLoaderData, Form, useActionData, useNavigation } from 'react-router';
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
//import { getAuthenticatedUser } from '../auth.server'; // Import server-side auth function



// Define schemas for client-side validation
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  // Add other profile fields you want to allow updating
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
  confirmNewPassword: z.string().min(8, { message: 'Confirm new password is required' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});


type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PageProps {
  user:UserData
}


const DashboardProfile: React.FC<PageProps> = ({user}) => {
    //const { user } = useLoaderData<typeof loader>();
     const actionData = useActionData();
     const navigation = useNavigation();
     const isSubmitting = navigation.state === 'submitting';

     

   
   const profileForm = useForm<ProfileFormValues>({
     resolver: zodResolver(profileSchema),
     defaultValues: {
       name: user?.name || '',
       email: user?.email || '',
       
     },
       resetOptions: {
           keepDirtyValues: true, // Keep user input if validation fails
           keepErrors: true,
       },
   });

   // React Hook Form setup for Password Change
    const passwordChangeForm = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
         // Reset form when action is successful for this form type
          resetOptions: {
              keepDirtyValues: true,
              keepErrors: true,
          },
    });

    // Reset forms on successful action submission
    React.useEffect(() => {
        if (actionData?.formType === 'updateProfile' && actionData?.message) {
            profileForm.reset(profileForm.getValues()); // Reset with current form values
            // TODO: Display success message
        }
        if (actionData?.formType === 'changePassword' && actionData?.message) {
            passwordChangeForm.reset(); // Clear password fields
            // TODO: Display success message
        }
         if (actionData?.error) {
            // TODO: Display error message (e.g., using a toast)
             console.error('Profile Action Error:', actionData.error);
         }
    }, [actionData, profileForm, passwordChangeForm]);


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
                 <Form method="post" onSubmit={profileForm.handleSubmit((values) => { /* Client-side validation */ })} className="space-y-6">
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
                   {/* Add more profile fields */}
                    <Button type="submit" className="bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting && actionData?.formType === 'updateProfile'}>
                        {isSubmitting && actionData?.formType === 'updateProfile' ? 'Saving...' : 'Save Changes'}
                   </Button>
                    {actionData?.formType === 'updateProfile' && actionData?.error && (
                       <p className="text-red-500 mt-4">{actionData.error}</p>
                    )}
                     {actionData?.formType === 'updateProfile' && actionData?.message && (
                        <p className="text-green-500 mt-4">{actionData.message}</p>
                     )}
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
                <Form method="post" onSubmit={passwordChangeForm.handleSubmit((values) => { /* Client-side validation */ })} className="space-y-6">
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
                   <Button type="submit" className="bg-amber-300 text-gray-900 hover:bg-amber-400" disabled={isSubmitting && actionData?.formType === 'changePassword'}>
                       {isSubmitting && actionData?.formType === 'changePassword' ? 'Changing...' : 'Change Password'}
                   </Button>
                     {actionData?.formType === 'changePassword' && actionData?.error && (
                       <p className="text-red-500 mt-4">{actionData.error}</p>
                    )}
                     {actionData?.formType === 'changePassword' && actionData?.message && (
                        <p className="text-green-500 mt-4">{actionData.message}</p>
                     )}
                </Form>
            </ShadcnForm>
         </CardContent>
       </Card>
    </div>
    </SectionWrapper>
  );
};

export default DashboardProfile;