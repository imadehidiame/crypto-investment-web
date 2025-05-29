import { useEffect, useRef } from 'react';
import { Form, useActionData } from 'react-router';
import type { ActionFunction } from '@remix-run/node';
import gsap from 'gsap';
import { Mail, Phone, MapPin, Twitter, Linkedin, MessageCircle, X } from 'lucide-react';
//import { databases } from '~/lib/appwrite';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    /*await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID || '',
      process.env.APPWRITE_CONTACTS_COLLECTION_ID || '',
      'unique()',
      { name, email, message, createdAt: new Date().toISOString() }
    );*/
    return { success: true, message: 'Form submitted successfully!' };
  } catch (error) {
    console.error('Failed to submit form:', error);
    return { success: false, message: 'Failed to submit form. Please try again.' };
  }
};
const useScrollAnimation = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current && typeof window !== 'undefined') {
        import('gsap').then((gsap) => {
          import('gsap/ScrollTrigger').then((ScrollTrigger) => {
            gsap.default.registerPlugin(ScrollTrigger.default);
            gsap.default.fromTo(
              elementRef.current,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: elementRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            );
            ScrollTrigger.default.refresh();
          });
        });
      }
    }, []);
    return elementRef;
  };

export default function Contact() {
  const formRef = useScrollAnimation();
  const infoRef = useScrollAnimation();
  const actionData = useActionData<{ success?: boolean; message?: string }>();

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-16 px-4 md:px-6 bg-white">
      <div ref={formRef} className="text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-dark">Get in Touch</h1>
        <p className="text-lg md:text-xl mb-8 text-dark font-medium max-w-3xl mx-auto">
          Have questions or need assistance? Our team is ready to support your investment journey.
        </p>
        {actionData && (
          <p className={actionData.success ? 'text-green-500' : 'text-red-500'}>{actionData.message}</p>
        )}
        <Form method="post" className="max-w-lg mx-auto space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-4 rounded bg-white text-dark border border-gray focus:outline-none focus:border-gold"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-4 rounded bg-white text-dark border border-gray focus:outline-none focus:border-gold"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full p-4 rounded bg-white text-dark border border-gray focus:outline-none focus:border-gold"
            rows={5}
            required
          ></textarea>
          <button type="submit" className="btn w-full">
            Send Message
          </button>
        </Form>
      </div>
      <div ref={infoRef} className="py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-dark">Contact Information</h2>
        <div className="flex flex-col items-center space-y-4 text-dark font-medium">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-gold mr-2" />
            <p>123 Wealth Street, Financial District, NY 10001</p>
          </div>
          <div className="flex items-center">
            <Mail className="w-6 h-6 text-gold mr-2" />
            <p>Email: support@coininvestdesk.com</p>
          </div>
          <div className="flex items-center">
            <Phone className="w-6 h-6 text-gold mr-2" />
            <p>Phone: +1 (800) 123-4567</p>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-6">
          <a href="#" className="text-dark hover:text-gold"><X className="w-6 h-6" /></a>
          <a href="#" className="text-dark hover:text-gold"><Linkedin className="w-6 h-6" /></a>
          <a href="#" className="text-dark hover:text-gold"><MessageCircle className="w-6 h-6" /></a>
        </div>
      </div>
    </div>
  );
}