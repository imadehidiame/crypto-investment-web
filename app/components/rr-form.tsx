// app/components/rr-form.tsx
import {
  Form,
  type FormProps,
  useNavigation,
  useActionData,
} from "react-router";
import { forwardRef, useEffect, type ReactNode } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Toasting } from "./loader/loading-anime";

interface ActionData {
  data: {
    logged?: boolean;
    error?: string;
    errors?: Record<string, string[] | string>;
    data?: any;
    message?: string | any;
  };
}

interface CustomFormProps<T extends z.ZodType<any, any>> extends FormProps {
  schema: T;
  form: UseFormReturn<z.infer<T>>;
  validateValues?: string[];
  notify?: (error: string) => void;
  submitForm: (values: z.infer<T>) => Promise<void>;
  loadAnimation?: () => void;
  hideAnimation?: () => void;
  afterSubmitAction?: (message: string | any, data: any) => void;
  className?: string;
  children: ReactNode;
}

export const RRForm = forwardRef<HTMLFormElement, CustomFormProps<any>>(
  (
    {
      schema,
      form,
      validateValues,
      notify,
      submitForm,
      loadAnimation,
      hideAnimation,
      afterSubmitAction,
      className,
      children,
      ...formProps
    },
    ref
  ) => {
    const navigation = useNavigation();
    const actionData = useActionData<ActionData>();

    const handleFormSubmission = async (values: z.infer<typeof schema>) => {
      await submitForm(values);
    };

    useEffect(() => {
      if (navigation.state === "submitting") {
        //loadAnimation?.();
      } else {
        hideAnimation?.();
      }
    }, [navigation.state, loadAnimation, hideAnimation]);
    
    useEffect(() => {
      if (navigation.state === "idle" && actionData) {
        const { errors, error, data, message, logged } = actionData.data;
        if ((!errors && !error) || (logged && logged === true)) {
          console.log('After submit execution');
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
    }, [navigation.state]);

    return (
      <FormProvider {...form}>
        <Form
          ref={ref}
          {...formProps}
          onSubmit={form.handleSubmit(handleFormSubmission)}
          className={className}
        >
          {children}
        </Form>
      </FormProvider>
    );
  }
);

RRForm.displayName = "RRForm";