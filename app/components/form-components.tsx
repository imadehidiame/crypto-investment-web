'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "app/components/ui/select"
import { Input } from "./ui/input"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormFieldContext } from "./ui/form-mod"
//import ImageUpload from "./image-upload";
import { Checkbox } from "./ui/checkbox";
import ImageUploader from "./image-uploder";
import AddImageSvg from "./add-image-svg";
import { cn, NumberFormat } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import ImageUploaderMultiple from "./image-uploader-multiple";
//import type { z } from "zod";
import LexicalTextEditor from "./lexical-text-editor";
import NumberField from "./number-field";
//import AddImageSvg from "@/app/(app_root)/adm_priv/(dashboard)/[store]/(routes)/billboards/[billboard]/components/add-image.svg";

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
  field_classnames?:string;
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


export const FormFieldComponent = <T extends FieldValues>({ form, name, placeholder, label, description, className,field_classnames, input_type = "text", label_classname,icon,id,disabled,on_change }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{name}}>
      <FormField
        control={form.control} 
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)}>
            {label && <FormLabel className={label_classname}>{label}</FormLabel>}
            <FormControl>
              <Input placeholder={placeholder} {...field} id={id} className={cn(field_classnames)} disabled={disabled} type={input_type} value={field.value ? field.value : ''} onBlur={(e)=>{
                field.onChange(e);
                on_change?.(e.target.value);
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

type Validators = (value:any)=>string;
type Validation<T> = {
  [x in keyof T]: (value: any) => string|undefined;
};

interface FormFieldComponentPropsDefault< T extends Record<string,any>,U extends Record<string,string|undefined> > {
  form_object: T;
  error_object:U;
  validators:Validation<U>;
  name: keyof T & string;
  placeholder: string | undefined;
  description?: string;
  label?: string;
  className?: string;
  input_type?: string;
  label_classname?: string;
  icon?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  is_multiple?: boolean;
  size_limit?: number;
  file_count?: number;
  contentEditable?:boolean;
  field_classnames?: string;
  on_change?: (value: any,name : keyof T & string) => void;
  setErrorObject: React.Dispatch<React.SetStateAction<U>>;
  setFormObject: React.Dispatch<React.SetStateAction<T>>; // Add a setter for your form object
}

//type Validaators<T> = {[name as string] : (value:any)=>string}


export const FormTextFieldDefault = < T extends Record<string,any>,U extends Record<string,string|undefined> >({
  form_object,
  error_object,
  name,
  placeholder,
  label,
  description,
  className,
  field_classnames,
  input_type = "text",
  label_classname,
  icon,
  id,
  disabled,
  validators,
  contentEditable,
  on_change,
  setFormObject, // Receive the setter function
  setErrorObject,
}: FormFieldComponentPropsDefault<T,U>) => {
  // Function to update the form_object
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validate = validators[name as keyof U](value)
    setFormObject(prev => ({ ...prev, [name as string]: value })); // Update the specific field in your object
    setErrorObject(prev => ({...prev,[name]:validate}));
    on_change?.(value,name); // Call the external onChange if provided
  };

  // Get the current value from your form_object
  const fieldValue = form_object[name as keyof T] as string | undefined;
  const error = error_object[name as keyof U] as string | undefined;

  return (
    <div className={cn(className)}>
      {label && <label htmlFor={id} className={label_classname}>{label}</label>}
      <div className="relative">
        <Input
          placeholder={placeholder}
          id={id}
          className={cn(field_classnames)}
          disabled={disabled}
          type={input_type}
          value={fieldValue !== undefined ? String(fieldValue) : ''}
          onChange={handleInputChange}
          contentEditable={contentEditable}
        />
        {icon && <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">{icon}</div>}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      { error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};


export const FormTextareaComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,icon,id,disabled,on_change }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)}>
            {label && <FormLabel className={label_classname}>{label}</FormLabel>}
            <FormControl>
              <Textarea placeholder={placeholder} {...field} id={id} disabled={disabled} className={cn(field_classnames)} onBlur={(e)=>{
                field.onChange(e);
                on_change?.(e.target.value);
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

export const FormRichTextComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,disabled,on_change }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)} onBlur={()=>{
            on_change?.(field.value);
          }}>
            {label && <FormLabel className={cn(label_classname)}>{label}</FormLabel>}
            <FormControl>
              <LexicalTextEditor disable={disabled as boolean} value={field.value ? field.value : []} fieldChange={field.onChange} placeholder={placeholder} classNames={field_classnames} />
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
  }
}

export const FormNumberComponent = <T extends FieldValues>({ form, name, placeholder, field_classnames, label, description, className, label_classname,disabled,on_change,is_integer,flag }: NumberComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className={cn(className)} onBlur={()=>{
            on_change?.(field.value);
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

interface NumberComponentPropsDefault< T extends Record<string,string|number>,U extends Record<string,string|undefined>> extends FormFieldComponentPropsDefault<T,U> {
  is_integer:boolean;
  flag?:{
    allow_decimal?:boolean;
    allow_zero_start?:boolean;
    length_after_decimal?:number;
    add_if_empty?:boolean;
    total_length?:number;
    format_to_thousand?:boolean;
  },
  unformat?:boolean
}

export const FormNumberDefault = <T extends Record<string,any>,U extends Record<string,string|undefined>>({ name, placeholder,id, field_classnames, label, description, className, label_classname,disabled,on_change,is_integer,flag,setFormObject,form_object,error_object,setErrorObject,validators,contentEditable,unformat }: NumberComponentPropsDefault<T,U>) => {

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
    const validate = validators[name](value);
    const displayed_value = unformat ? value : is_integer ? NumberFormat.numbers_only(value,flag) : NumberFormat.thousands(value,flag);
    setFormObject(prev=>({...prev,[name]:displayed_value}));
    setErrorObject(prev=>({...prev,[name]:validate}));
    on_change?.(displayed_value,name);
  }
  const fieldValue = form_object[name as keyof T] ? form_object[name as keyof T] : undefined; 
  const error = error_object[name as keyof U] as string | undefined; 
  return (
    <div className={cn(className)}>
      {label && <label htmlFor={id} className={label_classname}>{label}</label>}
      <div className="relative">
        <Input
          placeholder={placeholder}
          id={id}
          className={cn(field_classnames)}
          disabled={disabled}
          contentEditable={contentEditable}
          type={'text'}
          value={fieldValue !== undefined ? String(fieldValue) : ''}
          onChange={handleInputChange}
        />
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      { error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
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

export const FormFileUploaderMod = <T extends FieldValues>({ form, name, label, description,is_multiple,size_limit,on_change }: FormFieldComponentProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField 
        control={form.control}
        name={name}
        render={({ field }) => (    
          <FormItem>
                    {
                      <div className="flex flex-col gap-2 justify-start max-w-5xl w-full">
                            <div className="flex gap-2 items-center justify-start">
                                <AddImageSvg />
                                <h2 className="font-semibold">{label}</h2>
                            </div>
                      </div>
                    }
            <FormControl>
              <ImageUploader fieldChange={field.onChange} extensions={['png','jpg','jpeg','svg','webp']} mediaUrl={typeof field.value == 'string' ? [field.value] : field.value} is_multiple={is_multiple} size_limit={size_limit} on_change={(value)=>{
                on_change?.(value)
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
    on_change?:(value:any)=>void
    select_content_class_name?:string;
}
  
  
export const FormSelectComponent = <T extends FieldValues>({ form, name, placeholder, description, field_classnames, label, selects, className, on_change, select_content_class_name }:SelectProps<T> ) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => ( // Use the render prop correctly
          <FormItem className={cn(className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <Select onValueChange={(e)=>{
              field.onChange(e);
              on_change?.(e);
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

interface SelectPropsDefault < T extends Record<string,any>,U extends Record<string,string> >{
  name: keyof T & string;
  selects: { name: string, value: string }[];
  //form: UseFormReturn<T>; 
  placeholder: string | undefined;
  form_object:T;
  error_object:U;
  validators:Record<keyof U,(value:any)=>string>;
  set_form_object:React.Dispatch<React.SetStateAction<T>>;
  set_error_object:React.Dispatch<React.SetStateAction<U>>
  description?: string;
  label?: string;
  id?:string;
  className?:string;
  field_classnames?:string;
  on_change?:(value:any,name:keyof T & string)=>void
  select_content_class_name?:string;
  label_classname?:string
}

export const FormSelectDefault = < T extends Record<string,any>,U extends Record<string,string> >({ name,id, placeholder, description, field_classnames, label, selects, className, on_change, select_content_class_name,validators,set_error_object,set_form_object,form_object,error_object,label_classname }:SelectPropsDefault<T,U> ) => {


  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>|string)=>{
    const value = typeof e == 'string' ? e : e.target.value;
    const validate = validators[name](value);
    //const displayed_value = is_integer ? NumberFormat.numbers_only(value,flag) : NumberFormat.thousands(value,flag);
    set_form_object(prev=>({...prev,[name]:value}));
    set_error_object(prev=>({...prev,[name]:validate}));
    on_change?.(value,name);
  }
  const fieldValue = form_object[name as keyof T] ? form_object[name as keyof T] : undefined; 
  const error = error_object[name as keyof U] as string | undefined; 


  return (
    <div className={cn(className)}>
      {label && (
        <label htmlFor={id} className={cn(label_classname)}>
          {label}
        </label>
      )}
      <div className="relative">
        <Select onValueChange={handleInputChange} value={fieldValue || ''}>
          <SelectTrigger className={cn(field_classnames)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={cn(select_content_class_name ?? 'bg-gray-800 text-gray-100 border-amber-300/50')}>
            {selects.map((select) => (
              <SelectItem key={select.value} value={select.value}>
                {select.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

interface CheckboxProps <T extends object>{
  name: Path<T>;
  checks: { name: string, value: string }[];
  form: UseFormReturn<T>; 
  description?: string;
  label?: string;
  className?: string;
  on_change?:(value:any)=>void
}

export const FormCheckboxComponent = <T extends FieldValues>({ form, name, description, label, checks,className }:CheckboxProps<T> ) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
          control={form.control}
          name={name}
          render={() => (
            <FormItem>
              <div className="">
                <FormLabel className="text-base">{label}</FormLabel>
                <FormDescription>
                  {description}
                </FormDescription>
              </div>
              {checks.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.name}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            className={className}
                            checked={(field.value as Array<any>)?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.value])
                                : field.onChange(
                                    (field.value as Array<any>)?.filter(
                                      (value) => value !== item.value
                                    )
                                  ) 
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
    </FormFieldContext.Provider>
  );
};


export const FormCheckboxComponentMod = <T extends FieldValues>({ form, name, description, label, checks,className="flex flex-row items-start space-x-3 space-y-0",on_change }:CheckboxProps<T> ) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormField
          control={form.control}
          name={name}
          render={({field}) => (
                <FormItem>
                  <div className="mb-4">
                      <FormLabel className="text-base">{label}</FormLabel>
                      <FormDescription>
                        {description}
                      </FormDescription>
                  </div>
                  <FormControl>
                    {checks.map((item)=>{
                      return (
                      <Checkbox
                        key={item.value}
                        className={className}
                        checked={(field.value as Array<any>)?.includes(item.value)}
                        onCheckedChange={(checked) => {
                          if(checked){
                            const field_value = [...field.value, item.value];
                            field.onChange(field_value)
                            on_change?.(field_value);
                          }else{
                            const field_value = (field.value as Array<any>)?.filter(
                              (value) => value !== item.value
                              );
                            field.onChange(field_value);
                            on_change?.(field_value);
                          }
                          /*return checked
                            ? field.onChange([...field.value, item.value])
                            : field.onChange(
                                (field.value as Array<any>)?.filter(
                                (value) => value !== item.value
                              )
                            )*/ 
                          }}
                      />
                    )
                    })}
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
        />
  </FormFieldContext.Provider>
  );
};