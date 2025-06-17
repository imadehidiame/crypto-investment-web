import type { Route } from "./+types/profile";

export const action = async ({request}:Route.ActionArgs)=>{
    const form_data = Object.fromEntries(await request.formData());
    console.log(form_data);
    return {error:'Invalid data submitted',data:JSON.stringify(form_data)};
}