import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';
import { Form, useActionData, useNavigation, useSubmit } from 'react-router';
import { Toasting } from '@/components/loader/loading-anime';
import { Loader2 } from 'lucide-react';




const ContactPage: React.FC = () => {
  const contactFormSchema = z.object({
    name: z.string().min(2, { message: 'Please tell us your name' }),
    email: z.string().email({ message: 'Invalid email address' }),
    subject: z.string().trim().min(1, { message: 'Please enter the message subject' }),
    message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' }),
  });
  const submit = useSubmit();
  type ContactFormValues = z.infer<typeof contactFormSchema>;
  
     
      const use_form  = useForm<ContactFormValues>({
        mode:'onSubmit',
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const {
      register,
      handleSubmit,
      trigger,
      reset,
      control,
      formState:{isSubmitting,errors}
} = use_form;

    const onSubmit:SubmitHandler<ContactFormValues> = async (value,event)=>{
        const valid = await trigger();
        if(!valid){
          event?.preventDefault();
          return;
        }
        submit(event?.target,{action:'/contact',method:'POST',encType:'application/x-www-form-urlencoded',replace:true});
    }

    const navigation = useNavigation();
    const action_data = useActionData<{logged:boolean,data:ContactFormValues}>();

    useEffect(()=>{
      if(action_data){
        ///console.log("Served data");
        //console.log(action_data.data);
        if(action_data.logged === true){
          Toasting.success('Your message has been sent and you will be contacted',7000);
          reset();
        }else{
          Toasting.error('An error occured along the way',7000);
        }
      }
    },[action_data]);

    const is_submitting = navigation.state === 'submitting';


  return (
    <SectionWrapper animationType='fadeInUp' md_padding='0' padding='0'>
      <section className="">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gold">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Information */}
          <Card className="p-6 border border-gold-500/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gold">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-2">
                {/* <Mail className="h-5 w-5 text-gold-500" /> */}
                <span>Email: support@cinvdesk.com</span>
              </div>
               <div className="flex items-center space-x-2">
                 {/* <Phone className="h-5 w-5 text-gold-500" /> */}
                 <span>Phone: +1 309 407 190</span> 
               </div>
                
               {/* Social Media Links (Add icons and links) */}
                <div className="flex space-x-4 mt-4">
                    {/* <a href="#" className="hover:text-gold-500"><Twitter className="h-6 w-6" /></a> */}
                    {/* Add other social icons */}
                </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="p-6 border border-gold-500/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gold">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
                    <ShadcnForm {...use_form}>
                     <Form 
                      action={'/contact'}
                      method='POST'
                      onSubmit={(event)=>{
                        handleSubmit(onSubmit)(event);
                      }} className="space-y-4">
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Your Name</FormLabel>
                                    <FormControl>
                                        <Input className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} name='name' />
                                    </FormControl>
                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Your Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} name="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                          <FormField
                            control={control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Subject</FormLabel>
                                    <FormControl>
                                        <Input className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} name="subject" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                           <FormField
                            control={control}
                            name="message" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Message</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} name="message" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       
                       <Button variant="outline" type='submit' className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                            { is_submitting &&  <Loader2 className='mr-2 h-5 w-5' />}
                            {is_submitting ? "Sending" : "Send Message"}
                        </Button>
                     </Form>
                  </ShadcnForm>
            </CardContent>
          </Card>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default ContactPage;