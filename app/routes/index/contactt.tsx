// pages/ContactUsPage.tsx
import React from 'react';

import type { Route } from './+types/contactt';
import { getSess } from '@/layouts/app-layout';
import { log } from '@/lib/utils';
import ContactPage from '@/components/app/index/contact-page';

// Import Lucide Icons for contact info
// import { Mail, Phone, MapPin } from 'lucide-react';


export const loader = async ({context}:Route.LoaderArgs) =>{
  //const { generateSessionToken } = await import('@/session.server');
  //log(generateSessionToken(),'Session Token');
  //log(generateSessionToken(),'Session Token');
  const sess_data = getSess(context);
  log(sess_data,'Session Data');
  return sess_data
}

export default function ({loaderData}:Route.ComponentProps) {
  console.log({loaderData});


  return (
    <ContactPage />
  );
};

//export default ContactUsPage;