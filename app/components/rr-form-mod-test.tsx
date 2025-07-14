import {
  Form,
  type FormProps,
  useNavigation,
  useActionData,
} from "react-router";
import { forwardRef, useEffect,useState,type ReactNode } from "react";
import { FormProvider, useForm, type FieldValues, type Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormCheckboxComponentMod, FormFieldComponent, FormFileUploaderMod, FormFileUploaderModMultiple, FormNumberComponent, FormRichTextComponent, FormSelectComponent, FormTextareaComponent } from "./form-components"; 
import { Toasting } from "./loader/loading-anime";
import { log } from "@/lib/utils";


export interface FormElementDefault<T extends FieldValues> {
  type: 'text' | 'select' | 'textarea' | 'file' | 'multiple_file' | 'checkbox' | 'component' | 'rich_text' | "integer" | "float" | "password";
  name?: string |  number | symbol;
  disabled?: boolean;
  value?: string | number | File | any | any[];
  label?: string;
  id?: string;
  form_state?:T;
  set_form_state?:React.Dispatch<React.SetStateAction<T>>;
  field_classnames?: string;
  validation?: z.ZodType;
  placeholder?: string;
  label_classnames?: string;
  size_limit?: number;
  file_count?: number;
  selects?: { name: string; value: string }[];
  checks?: { name: string; value: string }[];
  classNames?: string;
  component?: React.ReactNode;
  refine?: (value: any) => boolean | { valid: boolean; error: string; path?: string };
  flag?: {
    allow_decimal?: boolean;
    allow_zero_start?: boolean;
    length_after_decimal?: number;
    add_if_empty?: boolean;
    total_length?: number;
    format_to_thousand?: boolean;
    allow_negative_prefix?: boolean;
  };
}

interface ActionData {
  data: {
    logged?: boolean;
    error?: string;
    errors?: Record<string, string[] | string>;
    data?: unknown;
    message?: string;
  };
}

type RefinedResult = boolean 
| { valid: boolean; error: string; path ?: string | number | symbol }

type RefineFunction<T extends FieldValues> = (data: z.infer<z.ZodObject<T>>) => 
   boolean 
  | { valid: boolean; error: string; path?: keyof T | string | number | symbol };


export interface FormElement<T extends FieldValues> {
  type: 'text' | 'select' | 'textarea' | 'file' | 'multiple_file' | 'checkbox' | 'component' | 'rich_text' | 'float' | 'integer' | 'password';
  name?: keyof T | number | string | symbol;
  value?: string | number | File | any[] | null | undefined;
  classNames?: string;
  disabled?: boolean;
  field_classnames?: string;
  label_classnames?: string;
  label?: string;
  form_state?:T;
  set_form_state?:React.Dispatch<React.SetStateAction<T>>;
  id?: string;
  validation?: z.ZodType<T>;
  placeholder?: string;
  size_limit?: number;
  file_count?: number;
  selects?: { name: string; value: string }[];
  checks?: { name: string; value: string }[];
  component?: React.ReactNode;
  refine?: (value: any) => boolean | { valid: boolean; error: string; path?: string };
  flag?: {
    allow_decimal?: boolean;
    allow_zero_start?: boolean;
    length_after_decimal?: number;
    add_if_empty?: boolean;
    total_length?: number;
    format_to_thousand?: boolean;
    allow_negative_prefix?: boolean;
  };
}


interface CustomFormProps<T extends FieldValues> extends FormProps {
  validateValues?: string[];
  notify?: (error: string) => void;
  submitForm: (values: z.infer<z.ZodObject<T>>) => Promise<void>;
  loadAnimation?: () => void;
  hideAnimation?: () => void;
  afterSubmitAction?: (message: string | any, data: any) => void;
  className?: string;
  refine?: (value: any) => boolean | { valid: boolean; error: string; path?: string };
  redefine?:(value:z.infer<z.ZodObject<T>>) => {valid: boolean; error: string; path?: string}
  children?: ReactNode;
  form_components: FormElement<T>[];
  set_form_elements ?: React.Dispatch<React.SetStateAction<T[]>>;
  on_change?: (name: keyof T | string, value: any) => void;
}

export const RRFormDynamic = forwardRef<HTMLFormElement, CustomFormProps<any>>(
  (
    {
      validateValues,
      notify, 
      submitForm,
      loadAnimation,
      hideAnimation,
      set_form_elements,
      afterSubmitAction,
      on_change,
      refine,
      redefine,
      form_components,
      className,
      children,
      ...formProps
    },
    ref
  ) => {
    const form_components_mod = form_components.filter(e => e && e.validation && e.validation !== undefined);
    const [schema, set_schema] = useState(() => {
      const baseSchema = z.object(form_components_mod.reduce((acc, { name, validation }) => ({ ...acc, [name!]: validation }), {}));
      const f_values = form_components_mod.reduce(
        (acc, { name, value }) => ({ ...acc, [name!]: value !== undefined ? value : '' }),
        {}
      );
      let result = redefine?.(f_values);
      return redefine 
        ? baseSchema.refine((data) => {
          let res = redefine(data)

            return res.valid
            
          },
          {message:redefine?.(f_values).error,path:[result?.path as string]}
        )
        : baseSchema;
    });

    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: form_components_mod.reduce(
        (acc, { name, value }) => ({ ...acc, [name!]: value !== undefined ? value : '' }),
        {}
      ),
    });

    useEffect(() => {
      const form_components_mod = form_components.filter(e => e && e.validation && e.validation !== undefined);
      const new_schema = z.object(form_components_mod.reduce((acc, { name, validation }) => ({ ...acc, [name!]: validation }), {}));
      const f_values = form_components_mod.reduce((prev,{name,value})=>({...prev,[name!]:value !== undefined ? value : ''}),{});
      const res = redefine?.(f_values);
      const refined_schema = redefine 
        ? new_schema.refine((data) => {
            const {valid} = redefine?.(data);
            return valid;
          },{message:redefine?.(f_values).error,path:[res?.path as string]})
        : new_schema;
      set_schema(refined_schema);
      form.reset(
        f_values,
        { keepDirty: true, keepErrors: true, keepIsSubmitted: true, keepTouched: true }
      );
      form.control._options.resolver = zodResolver(refined_schema);
      
    }, [form_components, redefine, form]);

    function pick(elements: FormElement<FieldValues>[]) {
      let obj = {};
      elements.forEach(element => {
        const { name, validation } = element;
        if (name)
          obj = Object.assign({}, obj, { [name]: validation });
      });
      return obj;
    }

    function strip_field_props<T, U>(field_errors: T): Partial<Record<keyof T, U>> {
      const ret: Partial<Record<keyof T, U>> = {};
      const keys = Object.keys(field_errors ?? {}) as (keyof T)[];
      for (const key of keys) {
        const errors = field_errors[key] as U | undefined;
        if (errors)
          ret[key as keyof T] = errors;
      }
      return ret;
    }

    const navigation = useNavigation();
    const actionData = useActionData<ActionData>();
    const loading = navigation.state === 'submitting';

    // Handle form submission
    const handleFormSubmission = async (values: z.infer<typeof schema>) => {
      await submitForm(values);
    };

    // Handle navigation state
    useEffect(() => {
      if (navigation.state === "submitting") {
        loadAnimation?.();
      } else {
        hideAnimation?.();
      }
    }, [navigation.state, loadAnimation, hideAnimation]);

    /**
     { "error": { "message": "Network Error", "name": "AxiosError", "config": { "transitional": { "silentJSONParsing": true, "forcedJSONParsing": true, "clarifyTimeoutError": false }, "adapter": [ "xhr", "http", "fetch" ], "transformRequest": [ null ], "transformResponse": [ null ], "timeout": 0, "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN", "maxContentLength": -1, "maxBodyLength": -1, "env": {}, "headers": { "Accept": "application/json;charset=utf-8", "Content-Type": "application/json", "Strict-Transport-Security": "max-age=7776000; includeSubDomains", "X-XSS-Protection": "1; mode=block", "X-Content-Type-Options": "nosniff" }, "params": { "chatbot_label": "vps", "use_helpdesk": false }, "method": "get", "url": "https://message-hub.hostinger.com/api/v1/chat/history", "allowAbsoluteUrls": true, "withCredentials": true }, "code": "ERR_NETWORK" } }
{ "error": { "message": "Network Error", "name": "AxiosError", "config": { "transitional": { "silentJ
     */

    useEffect(() => {
      if (navigation.state === "idle" && actionData) {
        const { errors, error, data, message, logged } = actionData.data;
        console.log({ errors, error, data, message, logged });
        if ((!errors && !error) || (logged && logged === true)) {
          afterSubmitAction?.(message, data); 
        } else {
          if (errors && validateValues) {
            validateValues.forEach((key) => {
              if (errors[key]) {
                form.setError(key as any, { message: errors[key][0] });
              }
            });
          }
          if (error) {
            notify ? notify(error) : Toasting.error(error, 10000);
          }
        }
      }
    }, [navigation.state, actionData]);

    // Handle refine errors from form validation
    useEffect(() => {
      const errors = form.formState.errors;
      if (errors.root?.message && errors.root?.refinePath) {
        form.setError(errors.root.refinePath as any, { message: errors.root.message });
      }
    }, [form.formState.errors, form]);

    return (
      <FormProvider {...form}>
        <Form
          ref={ref}
          {...formProps}
          onSubmit={(e)=>{
            //if(form.getFieldState())
            console.log(form.formState.errors.root?.message);
            form.handleSubmit(handleFormSubmission)
          }}
          className={className}
        >
          {form_components.map(({ id, name, placeholder, type, label, classNames, size_limit, file_count, selects, checks, component, field_classnames, label_classnames, flag }) => {
            //const { id, name, placeholder, type, label, classNames, size_limit, file_count, selects, checks, component, field_classnames, label_classnames, flag, value } = element;
            let ret_value;
            if (type === 'text' || type === 'password')
              ret_value = (
                <FormFieldComponent
                  key={name as string}
                  form={form}
                  field_classnames={field_classnames}
                  label={label}
                  //form_state={form_state}
                  //set_form_state={set_form_state}
                  className={classNames}
                  name={name as Path<z.infer<typeof schema>>}
                  input_type={type}
                  placeholder={placeholder}
                  id={id ? id : name as string}
                  on_change={(value) => {
                    //console.log('text field');
                    //console.log({ value });
                    //console.log(element.name);
                    //set_form_state?.(prev=>prev)
                    if(set_form_elements)
                    set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                     else
                    on_change?.(name!, value);
                  }}
                />
              );
            else if (type === 'textarea')
              ret_value = (
                <FormTextareaComponent
                  key={name as string}
                  form={form}
                  field_classnames={field_classnames}
                  className={classNames}
                  label={label}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  id={id ? id : name as string}
                  on_change={(value) => {
                    //console.log('Text area');
                    //console.log({ value });
                    //console.log(element.name);
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                    //set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                  }}
                />
              );
            else if (type === 'component')
              ret_value = (<span key={name as string}>{component}</span>);
            else if (type === 'multiple_file')
              ret_value = (
                <FormFileUploaderModMultiple
                  key={name as string}
                  form={form}
                  className={classNames}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  id={id ? id : name as string}
                  label={label}
                  size_limit={size_limit}
                  file_count={file_count}
                  is_multiple={true}
                  on_change={(value) => {
                    console.log('Multiple file');
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );
            else if (type === 'rich_text')
              ret_value = (
                <FormRichTextComponent
                  key={name as string}
                  form={form}
                  disabled={true}
                  className={classNames}
                  field_classnames={field_classnames}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  label={label}
                  label_classname={label_classnames}
                  on_change={(value) => {
                    //log(value, 'Rich text value');
                    //on_change?.(element.name!, value);'
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );
            else if (type === 'float')
              ret_value = (
                <FormNumberComponent
                  is_integer={false}
                  key={name as string}
                  form={form}
                  className={classNames}
                  flag={flag}
                  field_classnames={field_classnames}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  label={label}
                  label_classname={label_classnames}
                  on_change={(value) => {
                    //log(value, 'Number value float');
                    //on_change?.(element.name!, value);
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );
            else if (type === 'integer')
              ret_value = (
                <FormNumberComponent
                  is_integer={true}
                  flag={flag}
                  key={name as string}
                  form={form}
                  className={classNames}
                  field_classnames={field_classnames}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  label={label}
                  label_classname={label_classnames}
                  on_change={(value) => {
                    //log(value, 'Number value integer');
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                    //on_change?.(element.name!, value);
                  }}
                />
              );
            else if (type === 'select')
              ret_value = (
                <FormSelectComponent
                  key={name as string}
                  form={form}
                  field_classnames={field_classnames}
                  className={classNames}
                  selects={selects!}
                  label={label}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  on_change={(value) => {
                    //console.log('Select');
                    //console.log({ value });
                    //console.log(name);
                    //on_change?.(element.name!, value);
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );
            else if (type === 'checkbox')
              ret_value = (
                <FormCheckboxComponentMod
                  key={name as string}
                  form={form}
                  className={classNames}
                  checks={checks!}
                  label={label}
                  name={name as Path<z.infer<typeof schema>>}
                  on_change={(value) => {
                    //console.log('check box');
                    //console.log({ value });
                    //console.log(element.name);
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );
            else
              ret_value = (
                <FormFileUploaderMod
                  key={name as string}
                  form={form}
                  className={classNames}
                  name={name as Path<z.infer<typeof schema>>}
                  placeholder={placeholder}
                  id={id ? id : name as string}
                  label={label}
                  size_limit={size_limit}
                  on_change={(value) => {
                    if(set_form_elements)
                      set_form_elements?.(prev=>prev.map(e=>e.name && e.name === name ? {...e,value}:e))
                       else
                      on_change?.(name!, value);
                  }}
                />
              );

            return ret_value;
          })}
          {children}
        </Form>
      </FormProvider>
    );
  }
);

RRFormDynamic.displayName = "RRFormDynamic";

export function get_form_data<T extends FieldValues>(
  type: "text" | "select" | "textarea" | "file" | "multiple_file" | "checkbox" | "component" | "rich_text" | "float" | "integer" | "password",
  name?: string | number | symbol,
  value?: any,
  validation?: z.ZodType,
  label?: string,
  placeholder?: string,
  checks?: { name: string; value: string }[],
  size_limit?: number,
  file_count?: number,
  selects?: { name: string; value: string }[],
  classNames?: string,
  field_classnames?: string,
  component?: React.ReactNode,
  disabled?: boolean,
  label_classnames?: string,
  flag?: {
    allow_decimal?: boolean;
    allow_zero_start?: boolean;
    length_after_decimal?: number;
    add_if_empty?: boolean;
    total_length?: number;
    format_to_thousand?: boolean;
    allow_negative_prefix?: boolean;
  },
  refine?: (value: any) => boolean | { valid: boolean; error: string; path?: string },
  form_state?:T,
  set_form_state?:React.Dispatch<React.SetStateAction<T>>,
) {
  return {
    type,
    name,
    value,
    validation,
    label,
    placeholder,
    checks,
    size_limit,
    file_count,
    selects,
    classNames,
    field_classnames,
    component,
    disabled,
    label_classnames,
    flag,
    refine,
    form_state,
    set_form_state
  };
}

