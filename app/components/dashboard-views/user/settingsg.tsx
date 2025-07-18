import React, { useState, useEffect, useRef } from 'react'; 
import { Form, useActionData, useNavigation, useSubmit } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { Trash2, Edit, PlusCircle, CreditCard, Loader2 } from 'lucide-react'; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { get_form_data, RRFormDynamic } from '@/components/rr-form-mod-test';
import { Toasting } from '@/components/loader/loading-anime';
import SwitchComponent from '@/components/switch-component';
import { log } from '@/lib/utils';



interface WalletAddress {
    _id: string; 
    address: string;
    currency: string;
    label: string;
    createdAt: string; 
}

export interface SettingsData {
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        notifyOnLogin?: boolean;
        twofa_auth?: boolean;
    };
    general: {
        language: string;
    };
    wallets: WalletAddress[]; 
    currencies?: { name: string, value: string }[]
}

interface PageProps {
    settings: SettingsData;
    session?:string|null
}


// --- Zod Schemas ---
const notificationSettingsSchema = z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    notifyOnLogin: z.boolean().optional(),
    twofa_auth: z.boolean().optional()
});

const generalSettingsSchema = z.object({
    language: z.string(),
});

// Define schema for adding a new wallet address
const addWalletSchema = z.object({
    address: z.string().min(10, { message: 'Wallet address is required' }), // Basic validation
    currency: z.string().min(1, { message: 'Currency is required' }),
    label: z.string().min(1, { message: 'Label is required' }),
});

// Define schema for updating an existing wallet address
const updateWalletSchema = z.object({
    _id: z.string(), // Wallet ID is required for update
    label: z.string().min(1, { message: 'Label is required' }),
    currency: z.string().min(1, { message: 'Currency is required' }),
    address: z.string().min(10, { message: 'Wallet address is required' }), // Basic validation
});




const SettingsPage: React.FC<PageProps> = ({ settings,session }) => {

    const [settings_state, set_settings_state] = useState(settings);
    //const [flash_session,set_flash_session] = useState('page_loaded');
      const { general, notifications, wallets } = settings_state;
      const submit = useSubmit();
      const navigation = useNavigation();
      const actionData = useActionData<{
        data: { logged: boolean; data?: WalletAddress; message?: string; error?: string; formType?: string };
      }>();
      const isSubmitting = navigation.state === 'submitting';
      const submittingFormType = isSubmitting ? navigation.formData?.get('formType') : null;
      const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
      const editingWallet = wallets.find(w => w._id === editingWalletId);
      const lastSubmissionRef = useRef<string | null>(null);

    useEffect(() => {
        //log(settings, 'Settings From server');
        set_settings_state(settings);
      }, [settings]);
    
      
      
      

      useEffect(() => {
        //set_flash_session(session);
        if(navigation.state === 'loading' && navigation.formAction?.includes('api/delete-wallet') && navigation.formMethod === 'DELETE'){
            //console.log(navigation.formData);
            Toasting.success('Wallet has been deleted successfully',10000);
        }
        //log(navigation,'Navigation data');
        //log(navigation.state,'Navigation state');;
        /*if (actionData?.data?.error) {
          Toasting.error(actionData.data.error, 10000);
        }
        if (actionData?.data?.message && actionData?.data?.logged) {
          Toasting.success(actionData.data.message, 10000);
          if (actionData?.data?.formType === 'deleteWallet') {
            setEditingWalletId(null);
          }
        }*/
      }, [navigation.state]);

      
    
      const { label, currency, address } = addWalletSchema.shape;
      const form_data = [
        get_form_data(
          'text',
          'label',
          '',
          label,
          'Label',
          'e.g, My Bitcoin Wallet',
          undefined,
          undefined,
          undefined,
          undefined,
          'w-full',
          'bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300',
          undefined,
          navigation.state === 'submitting',
          undefined,
          undefined,
          undefined,
        ),
        get_form_data(
          'select',
          'currency',
          '',
          currency,
          'Currency',
          'Select currency from the list',
          undefined,
          undefined,
          undefined,
          settings.currencies ?? [
            { name: 'Bitcoin - BTC', value: 'Bitcoin' },
            { name: 'Ethereum - ETH', value: 'Ethereum' },
            { name: 'USDT', value: 'USDT' },
          ],
          'w-full',
          'bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300'
        ),
        get_form_data(
          'text',
          'address',
          '',
          address,
          'Wallet Address',
          'Enter wallet address',
          undefined,
          undefined,
          undefined,
          undefined,
          'w-full',
          'bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300'
        ),
      ];
      const [form_state, set_form_state] = useState(form_data);
       useEffect(()=>{
        log(form_state,'Form state value');
       },[form_state])
    
      useEffect(() => {
        if (editingWalletId) {
          const { label, currency, address } = wallets.find(e => e._id === editingWalletId)!;
          set_form_state(prev =>
            prev.map(e => ({
              ...e,
              value: e.name === 'label' ? label : e.name === 'currency' ? currency : address,
            }))
          );
        } else {
          set_form_state(prev => prev.map(e => ({ ...e, value: '' })));
        }
      }, [editingWalletId, wallets]);
    
      const on_form_change = (name: string | number | Symbol, value: any) => {
        set_form_state(prev => prev.map(e => (e.name === name ? { ...e, value } : e)));
      };
    
      const on_submit = async (form_value: any) => {
        const submissionKey = JSON.stringify(form_value);
        if (lastSubmissionRef.current === submissionKey) {
          //log('Duplicate submission prevented', form_value);
          return;
        }
        lastSubmissionRef.current = submissionKey;
    
        if (editingWalletId) {
          form_value._id = editingWalletId;
          form_value.formType = 'updateWallet';
        } else {
          form_value.formType = 'addWallet';
        }
        submit(form_value, {
          action: '/dashboard/settings',
          method: editingWalletId ? 'PATCH' : 'POST',
          encType: 'application/json',
          replace: true,
        });
      };
    
      const on_delete = async () => {
        if (!editingWalletId) return;
        submit(
          { _id: editingWalletId, formType: 'deleteWallet' },
          {
            action: '/dashboard/settings',
            method: 'DELETE',
            encType: 'application/json',
            replace: false,
          }
        );
      };

    const after_submit_action = (message: string, data: any) => {
        if(editingWalletId){
            set_settings_state(prev=>({...prev,wallets:prev.wallets.map(e=>(e._id === editingWalletId ? Object.assign({},e,data) : e))}));
            Toasting.success('Wallet has been updated successfully');
        }else{
        //log(data,'Data sent from server');
        //const { wallets } = settings_state;
        set_settings_state(prev=>({...prev,wallets:[...prev.wallets,data]}));
        Toasting.success('Wallet has been added successfully');
        //setEditingWalletId(prev=>data._id);
        }
    }

    
    

    return (
        // Assuming SectionWrapper provides padding, removed duplicate padding div
        <SectionWrapper animationType='slideInLeft' padding='6' md_padding='8'>
            <div className="space-y-8 max-sm:px-0">
                {/*<CardTitle className="text-3xl md:text-4xl font-medium text-amber-300">App Settings</CardTitle>*/}
                <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">App Settings</CardTitle>

                {/* Notification Settings */}
                <Card className="bg-gray-800 max-sm:py-6 max-sm:px-0 p-6  border border-amber-300/50">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-amber-300">Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent className='max-sm:px-3'>


                        <div className='space-y-4'>
                            <div className="bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200 flex flex-row items-center justify-between p-4">
                                <div>
                                    <label className="text-gray-300">Email Notifications</label>
                                    <div className="text-sm text-gray-500">Receive notifications via email.</div>
                                </div>




                                <SwitchComponent action='/api/settings-update' form_key='emailNotifications' method='PATCH' served_key='logged' name='emailNotifications' className='data-[state=checked]:bg-amber-300 data-[state=unchecked]:bg-gray-700' value={notifications.emailNotifications} id='emailNotifications' success='Setting has been updated successfully' error='An error occured along the way. Please try again later' after_submit_action={(id, check) => {
                                    set_settings_state(prev=>({...prev,notifications:{...notifications,emailNotifications:check}}));
                                }} use_form_data={true} />


                            </div>

                            {/*<div className="bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200 flex flex-row items-center justify-between p-4">
                                <div>
                                    <label className="text-gray-300">SMS Notifications</label>
                                    <div className="text-sm text-gray-500">Receive notifications via sms.</div>
                                </div>




                                <SwitchComponent action='/api/settings-update' form_key='smsNotifications' method='PATCH' served_key='logged' name='smsNotifications' className='data-[state=checked]:bg-amber-300 data-[state=unchecked]:bg-gray-700' value={notifications.smsNotifications} id='smsNotifications' success='Setting has been updated successfully' error='An error occured along the way. Please try again later' after_submit_action={(id, check) => {
                                    set_settings_state(prev=>({...prev,notifications:{...notifications,smsNotifications:check}}));
                                }} use_form_data={true} />


                            </div>*/}

                            <div className="bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200 flex flex-row items-center justify-between p-4">
                                <div>
                                    <label className="text-gray-300">Notify on Login</label>
                                    <div className="text-sm text-gray-500">Receive an email notification when you login.</div>
                                </div>




                                <SwitchComponent action='/api/settings-update' form_key='notifyOnLogin' method='PATCH' served_key='logged' name='notifyOnLogin' className='data-[state=checked]:bg-amber-300 data-[state=unchecked]:bg-gray-700' value={notifications.notifyOnLogin as boolean} id='notifyOnLogin' success='Setting has been updated successfully' error='An error occured along the way. Please try again later' after_submit_action={(id, check) => {
                                    set_settings_state(prev=>({...prev,notifications:{...notifications,notifyOnLogin:check}}));
                                }} />


                            </div>

                            {/*<div className="bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200 flex flex-row items-center justify-between p-4">
                                <div>
                                    <label className="text-amber-300 font-semibold">Two-Factor Authentication (2FA)</label>
                                    <div className="text-sm text-gray-500">Enable 2FA for added security (Requires separate setup).</div>
                                </div>




                                <SwitchComponent action='/api/settings-update' form_key='twofa_auth' method='PATCH' served_key='logged' name='twofa_auth' className='data-[state=checked]:bg-amber-300 data-[state=unchecked]:bg-gray-700' value={notifications.twofa_auth as boolean} id='twofa_auth' success='Setting has been updated successfully' error='An error occured along the way. Please try again later' after_submit_action={(id, check) => {
                                    set_settings_state(prev=>({...prev,notifications:{...notifications,twofa_auth:check}}));
                                }} />


                            </div>*/}


                        </div>
                    </CardContent>
                </Card>

                
                <Card className="bg-gray-800 p-6 border border-amber-300/50">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-amber-300">Wallet Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 max-sm:px-0">

                        {/* Add/Edit Wallet Form */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                {editingWallet ? <Edit className="h-5 w-5 text-amber-300" /> : <PlusCircle className="h-5 w-5 text-amber-300" />}
                                <span>{editingWallet ? 'Edit Wallet Address' : 'Add New Wallet Address'}</span>
                            </h3>
                            {/* Form for adding or editing wallets */}


                            <RRFormDynamic
                                form_components={form_state}
                                afterSubmitAction={after_submit_action}
                                redefine={(data)=>{
                                    const {label} = data;
                                    return {valid:wallets.findIndex(e=>e.label.toLocaleLowerCase().trim() === (label as string).trim().toLocaleLowerCase())< 0,error:`${label} has already been registered`,path:'label'}
                                }}
                                submitForm={on_submit}
                                set_form_elements={set_form_state}
                                //on_change={on_form_change}
                                className="space-y-6 p-0 md:p-0 flex flex-wrap gap-4 items-center"
                                notify={(notify) => {
                                    Toasting.error(notify, 10000);
                                }}
                                validateValues={['label','currency','address']}

                            >



                                    {editingWalletId && (
                                        <Button type="button" variant="outline" className="ml-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-crosshair" onClick={() => setEditingWalletId(null)} disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                    )}

                                <Button className="bg-amber-300 text-gray-900 hover:bg-amber-400 cursor-pointer" disabled={isSubmitting} type='submit'>
                                    {isSubmitting && <Loader2 className="animate-spin" />}
                                    {isSubmitting ?  editingWalletId ? 'Updating wallet' : 'Adding wwallet' : editingWallet ? 'Update wallet' : 'Add Wallet'}
                                </Button>



                            </RRFormDynamic>


                            
                        </div>

                        {/* Registered Wallets List */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4 text-white">Registered Wallet Addresses</h3>
                            {wallets.length > 0 ? (
                                <div className="space-y-4"> {/* Use space-y-4 for vertical stacking */}
                                    {wallets.map(wallet => (
                                        // Display wallet info in a responsive card/div structure
                                        <Card key={wallet._id} className="bg-gray-900 rounded-lg border hover:bg-gray-800 transition-colors duration-200 p-4 border-gray-600 flex flex-col sm:flex-row sm:items-center justify-between">
                                            <div className="flex-grow mb-4 sm:mb-0">
                                                <div className="text-amber-300 font-semibold flex items-center space-x-2">
                                                    <CreditCard className="h-5 w-5" /> {/* Icon */}
                                                    <span>{wallet.label} ({wallet.currency})</span>
                                                </div>
                                                <div className="text-gray-300 text-sm break-all">{wallet.address}</div> {/* break-all for long addresses */}
                                                <div className="text-gray-500 text-xs mt-1">Added on: {new Date(wallet.createdAt).toLocaleDateString()}</div> {/* Format date */}
                                            </div>
                                            {/* Action buttons (Edit and Delete) */}
                                            <div className="flex space-x-2 justify-end sm:justify-start">
                                                {/* Edit Button */}
                                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-amber-300" onClick={() => setEditingWalletId(wallet._id)} disabled={isSubmitting}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>

                                                {/* Delete Button with Confirmation */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        {/* Button to open the AlertDialog */}
                                                        <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30" disabled={isSubmitting} onClick={()=>setEditingWalletId(wallet._id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    {editingWalletId && <DialogContent className="bg-gray-800 text-gray-100 border-amber-300/50">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white">Are you sure?</DialogTitle>
                                                            <DialogDescription className="text-gray-300">
                                                                This action cannot be undone. This will permanently delete your wallet address: <span className="font-semibold">{wallet.label} ({wallet.currency})</span>.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            {/*<DialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">Cancel</AlertDialogCancel>*/}
                                                            {/* Form to trigger the delete action when confirmed */}
                                                            <Form method="DELETE" action={`/api/delete-wallet/${wallet._id}`} onSubmit={()=>{
                                                                setEditingWalletId(null);
                                                                //set_flash_session('submiting');
                                                            }} preventScrollReset={true}>
                                                                <input type="hidden" name="formType" value="deleteWallet" />
                                                                
                                                                <Button type="submit" className="bg-red-500 text-white hover:bg-red-600" disabled={isSubmitting}>
                                                                {(isSubmitting && submittingFormType === 'deleteWallet') && <Loader2 className="animate-spin" />}
                                                                    {isSubmitting && submittingFormType === 'deleteWallet' && navigation.formData?.get('walletId') === wallet._id ? 'Deleting...' : 'Delete'}
                                                                </Button>
                                                            </Form>
                                                        </DialogFooter>
                                                    </DialogContent>}
                                                </Dialog>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400">No wallet addresses registered yet.</p>
                            )}

                            {/* Success/Error message display specifically for wallet actions */}


                        </div>

                    </CardContent>
                </Card>


                {/* Existing General Settings (kept for completeness) */}
                {/* ... existing General Settings Card ... */}



            </div>
        </SectionWrapper>
    );
};

// Change the default export to use the component name
export default SettingsPage;