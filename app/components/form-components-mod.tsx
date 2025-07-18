'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "app/components/ui/select"
import { Input } from "./ui/input"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormFieldContext } from "@/components/ui/form-mod"
//import ImageUpload from "./image-upload";
import { Checkbox } from "./ui/checkbox";
import ImageUploader from "./image-uploder";
import AddImageSvg from "./add-image-svg";
//import { cn, log, NumberFormat } from "@/lib/utils";
import { NumberFormat } from "./number-field";
import { Textarea } from "./ui/textarea";
import ImageUploaderMultiple from "./image-uploader-multiple";
//import type { z } from "zod";
import LexicalTextEditor from "./lexical-text-editor";
import NumberField from "./number-field";
import { cn } from "@/lib/utils";
import FileUploader from "./file-uploader";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
//import AddImageSvg from "@/app/(app_root)/adm_priv/(dashboard)/[store]/(routes)/billboards/[billboard]/components/add-image.svg";

export function log(value:any,title?:string){
  console.log(`${title?title+'\n':''}${value}`);
}

interface FormFieldComponentProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>; // Ensure name is a key of T
  placeholder: string | undefined;
  description?: string;
  label?: string;
  className?:string;
  input_type?:string;
  label_classname?:string;
  icon?:React.ReactNode;
  id?:string;
  disabled?:boolean;
  is_multiple?:boolean;
  size_limit?:number;
  file_count?:number;
  extensions?:string[];
  field_classnames?:string;
  form_state?:T;
  is_password?:boolean;
  set_form_state?:React.Dispatch<React.SetStateAction<T[]>>;
  on_change?:(value:any)=>void;
  
}

/**
 * 

<FormField control={form.control} name="img_url" render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Background Image 
                                </FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []} button_name="Upload an Image" onRemove={()=>field.onChange('')} disabled={loading} onChange={(url)=>field.onChange(url)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

 */


export const FormFieldComponent = <T extends FieldValues>({ form, name, placeholder, label, description, className,field_classnames, input_type = "text", label_classname,icon,id,disabled,on_change,set_form_state,form_state,is_password }: FormFieldComponentProps<T>) => {
  const [inputt_type,set_input_type] = useState(input_type);
  return (
    <FormFieldContext.Provider value={{name}}>
      <FormField
        control={form.control} 
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)}>
            {label && <FormLabel className={label_classname}>{label}</FormLabel>}
            <div className="relative">
              
              <Input placeholder={placeholder} {...field} id={id} className={cn(field_classnames)} disabled={disabled} type={inputt_type} value={field.value ? field.value : ''} onBlur={(ev)=>{
                field.onChange(ev);
                on_change?.(ev.target.value);
                //log(form_state,'Current form state'); 
                //set_form_state?.(prev=>({...prev,[name]:e.target.value}));
                set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:ev.target.value}:e));
                //if(set_form_state && form_state){
                 // set_form_state?.(prev=>({...prev,[name]:e.target.value}));
                //}
              }} />
              
              {
                is_password ?
                <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-50 hover:text-amber-300 cursor-pointer focus:outline-none"
                onClick={()=>set_input_type(prev=>prev=='password'?'text':'password')}
              >
                { inputt_type === 'text' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
                :
                null
              }
              
            </div>
            
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}}
      > 
        
      </FormField>
    </FormFieldContext.Provider>
  );
};

type Validators = (value:any)=>string;



export const FormTextareaComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,icon,id,disabled,on_change,set_form_state }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)}>
            {label && <FormLabel className={cn(label_classname)}>{label}</FormLabel>}
            <FormControl>
              <Textarea placeholder={placeholder} {...field} id={id} disabled={disabled} className={cn(field_classnames)} onBlur={(ev)=>{
                ///console.log(e);
                field.onChange(ev);
                on_change?.(ev.target.value);
                set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:ev.target.value}:e));
              }} />
            </FormControl>
            {icon && icon}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem> 
        )}}
      > 
        
      </FormField>
    </FormFieldContext.Provider>
  );
};

interface IRichText<T extends FieldValues> extends FormFieldComponentProps<T> {
  insertion?:string
}

export const FormRichTextComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,disabled,insertion,on_change,set_form_state }: IRichText<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)} onBlur={()=>{
            on_change?.(field.value);
            set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:field.value}:e))
          }}>
            {label && <FormLabel className={cn(label_classname)}>{label}</FormLabel>}
            <FormControl>
              <LexicalTextEditor disable={disabled as boolean} value={field.value ? field.value : []} fieldChange={field.onChange} placeholder={placeholder} classNames={field_classnames} insertion={insertion} />
            </FormControl>
            
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}}
      > 
        
      </FormField>
    </FormFieldContext.Provider>
  );
};

interface NumberComponentProps<T extends FieldValues> extends FormFieldComponentProps<T> {
  is_integer:boolean;
  flag?:{
    allow_decimal?:boolean;
    allow_zero_start?:boolean;
    length_after_decimal?:number;
    add_if_empty?:boolean;
    total_length?:number;
    format_to_thousand?:boolean;
    extra_format?:{
      format:string|string[],
      space_character?:string
    }
  },
  
}

export const FormNumberComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,disabled,on_change,is_integer,flag,set_form_state }: NumberComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)} onBlur={()=>{
            on_change?.(field.value);
            set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:field.value}:e))
          }}>
            {label && <FormLabel className={cn(label_classname)}>{label}</FormLabel>}
            <FormControl>
              <NumberField value={field.value ? field.value : ''} disabled={disabled} on_change={field.onChange} placeholder={placeholder} field_class={field_classnames} is_integer={is_integer} flag={flag}  />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem> 
        )}}
      > 
      </FormField>
    </FormFieldContext.Provider>
  );
};



const on_close_action = async (value:string) =>{
  console.log('URL value in on_close_action ',value);
}

/**
 


 */

/*export const FormFieldCloudinaryComponent = <T extends object>({ form, name, label, description }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField 
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
            <ImageUpload value={field.value ? [field.value] : []} button_name="Upload an Image" onRemove={()=>field.onChange('')} onChange={(url)=>field.onChange(url)} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>} 
            <FormMessage />
          </FormItem>
        )}
      > 
        
      </FormField> 
    </FormFieldContext.Provider>
  );
};*/

/*export const FormFileUploader = <T extends object>({ form, name, label, description }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField 
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>

            <ImageUpload value={field.value ? [field.value] : []} button_name="Upload an Image" onRemove={()=>field.onChange('')} onChange={(url)=>field.onChange(url)} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>} 
            <FormMessage />
          </FormItem>
        )}
      > 
        
      </FormField> 
    </FormFieldContext.Provider>
  );
};*/

export const FormFileUploadComponent = <T extends FieldValues>({ form, name, id, label, description,is_multiple,className,size_limit,file_count,extensions,label_classname,on_change,set_form_state }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField 
        control={form.control}
        name={name}
        render={({ field }) => (    
          <FormItem className={cn(className)}>
                    {
                      <div className="flex flex-col gap-2 justify-start max-w-5xl w-full">
                            <div className="flex gap-2 items-center justify-start">
                                <AddImageSvg svg_color="text-amber-300" />
                                <h2 className={cn("font-semibold",label_classname)}>{label}</h2>
                            </div>
                      </div>
                    }
            <FormControl>
              <FileUploader fieldChange={(files)=>{
                field.onChange(files);
                //set_form_state?.(prev=>({...prev,[name]:files}));
                set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:files}:e))
                on_change?.(files);
              }} extensions={extensions} file_count={file_count} name={name} id={id} mediaUrl={typeof field.value == 'string' ? [field.value] : field.value} is_multiple={is_multiple} size_limit={size_limit} /*on_change={(value)=>{
                on_change?.(value)
              }}*/ />  
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>} 
            <FormMessage />
          </FormItem>
        )}
      > 
      </FormField> 
    </FormFieldContext.Provider>
  );
};

export const FormFileUploaderModMultiple = <T extends FieldValues>({ form, name, label, className, description,is_multiple,size_limit,file_count,on_change }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField 
        control={form.control}
        name={name}
        render={({ field }) => (    
          <FormItem className={cn(className)}>
                    {
                      <div className="flex flex-col gap-2 justify-start max-w-5xl w-full">
                            <div className="flex gap-2 items-center justify-start">
                                <AddImageSvg />
                                <h2 className="font-semibold">{label}</h2>
                            </div>
                      </div>
                    }
            <FormControl>
              <ImageUploaderMultiple fieldChange={(value)=>{
                field.onChange(value);
                console.log({value});
              }} extensions={['png','jpg','jpeg','svg','webp']} mediaUrl={typeof field.value == 'string' ? [field.value] : field.value} is_multiple={is_multiple} size_limit={size_limit} file_count={file_count} on_change={(value)=>{
                on_change?.(value);
              }} />  
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>} 
            <FormMessage />
          </FormItem>
        )} 
      > 
      </FormField> 
    </FormFieldContext.Provider>
  );
};

  
interface SelectProps <T extends FieldValues>{
    name: Path<T>;
    selects: { name: string, value: string }[];
    form: UseFormReturn<T>; 
    placeholder: string | undefined;
    description?: string;
    label?: string;
    className?:string;
    field_classnames?:string;
    label_classnames?:string;
    on_change?:(value:any)=>void
    select_content_class_name?:string;
    set_form_state?:React.Dispatch<React.SetStateAction<T[]>>
}
  
  
export const FormSelectComponent = <T extends FieldValues>({ form, name, placeholder, description, field_classnames, label,label_classnames, selects, className, on_change, select_content_class_name,set_form_state }:SelectProps<T> ) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => ( 
          <FormItem className={cn(className)}>
            {label && <FormLabel className={cn(label_classnames)}>{label}</FormLabel>}
            <Select onValueChange={(e)=>{
              field.onChange(e); 
              on_change?.(e);
              //set_form_state?.(prev=>({...prev,[name]:e}));
              set_form_state?.(prev=>prev.map(ev=>ev.name && ev.name === name ? {...ev,value:e}:ev));
            }} defaultValue={field.value} value={field.value ? field.value : ''}>
              <FormControl>
                <SelectTrigger className={cn(field_classnames)}>
                  {placeholder && <SelectValue placeholder={placeholder} />}
                </SelectTrigger> 
              </FormControl>
              <SelectContent className={cn(select_content_class_name ?? 'bg-gray-800 text-gray-100 border-amber-300/50' )}>
                {selects.map(select => (
                  <SelectItem key={select.value} value={select.value}>
                    {select.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </FormFieldContext.Provider>
  );
};



interface CheckboxProps <T extends object>{
  name: Path<T>;
  checks: { name: string, value: string }[];
  form: UseFormReturn<T>; 
  description?: string;
  label?: string;
  label_classnames?:string;
  className?: string;
  checkbox_classnames?:string;
  checkbox_label_classnames?:string;
  field_classnames?:string;
  on_change?:(value:any)=>void;
  set_form_state?:React.Dispatch<React.SetStateAction<T[]>>;
}

export const FormCheckboxComponent = <T extends FieldValues>({ form, name, description, label,label_classnames, checks,className,checkbox_classnames = 'data-[state=checked]:bg-white data-[state=checked]:text-black border-amber-300 dark:data-[state=checked]:bg-white data-[state=checked]:border-white', checkbox_label_classnames = "text-gray-100 ml-1", field_classnames = "flex flex-row items-start space-x-4 space-y-4 flex-wrap",set_form_state,on_change }:CheckboxProps<T> ) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
          control={form.control}
          name={name}
          render={({field}) => (
                <FormItem className={cn(className)}>
                  <div className="mb-4">
                      <FormLabel className={cn("text-base",label_classnames)}>{label}</FormLabel>
                      <FormDescription>
                        {description}
                      </FormDescription>
                  </div>
                  <div className={cn(field_classnames)}>
                    {checks.map((item)=>{
                      return (
                       <label key={item.value} className="flex items-center cursor-pointer" htmlFor={'check-id-'+item.value.replaceAll(' ','')}>

                      <Checkbox
                        id={'check-id-'+item.value.replaceAll(' ','')}
                        className={cn(checkbox_classnames)}
                        checked={(field.value as Array<any>)?.includes(item.value)}
                        onCheckedChange={(checked) => {
                          const field_value = checked ?  [...field.value, item.value] : (field.value as Array<any>).filter(e=>e!==item.value);
                          //set_form_state?.(prev=>({...prev,[name]:field_value}))
                          set_form_state?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value:field_value}:e))
                          on_change?.(field_value);
                          field.onChange(field_value);
                          }}
                      />
                      <span className={cn(checkbox_label_classnames)}>{item.name}</span>
                       </label> 
                    )
                    })}
                  </div>
                  <FormMessage />
              </FormItem>
              )}
        />
  </FormFieldContext.Provider>
  );
};