import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionWrapper from '@/components/shared/section-wrapper';




const ContactPage: React.FC = () => {
  const contactFormSchema = z.object({
    name: z.string().min(2, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    subject: z.string().min(5, { message: 'Subject is required' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  });
  
  type ContactFormValues = z.infer<typeof contactFormSchema>;
  
    const contactForm = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const handleContactSubmit = (values: ContactFormValues) => {
        console.log('Contact form submitted:', values);
        
    };


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
                <span>Email: support@coininvestdesk.com</span>
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
                 <Form {...contactForm}>
                     <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-4">
                        <FormField
                            control={contactForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Your Name</FormLabel>
                                    <FormControl>
                                        <Input className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={contactForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Your Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={contactForm.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Subject</FormLabel>
                                    <FormControl>
                                        <Input className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                           <FormField
                            control={contactForm.control}
                            name="message" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Message</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} className="bg-gray-700 border-gray-600 text-white focus:border-gold-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       
                       <Button variant="outline" className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                            Send Message
                        </Button>
                     </form>
                 </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default ContactPage;