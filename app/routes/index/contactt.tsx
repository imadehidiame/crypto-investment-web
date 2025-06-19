import type { Route } from './+types/contactt';
import { getSess } from '@/layouts/app-layout';
import ContactPage from '@/components/app/index/contact-page';


export const loader = async ({context}:Route.LoaderArgs) =>{
  const sess_data = getSess(context);
  return sess_data
}

export const action = async({request}:Route.ActionArgs) => {
  const data =  Object.fromEntries(await request.formData()) as {name:string,subject:string,email:string,message:string};
  return {logged:true}
}

export default function ({loaderData}:Route.ComponentProps) {
  return (
    <ContactPage />
  );
};

