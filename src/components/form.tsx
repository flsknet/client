import type { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { styled } from "@mui/material";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { z, type ZodObject } from "zod";

export const MUIForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

type FormProps<TSchema extends ZodObject<any>> = Omit<
  ComponentProps<typeof MUIForm>,
  "children" | "onSubmit"
> & {
  children?: (methods: UseFormReturn<z.infer<TSchema>>) => React.ReactNode;
  onSubmit?: (
    data: z.infer<TSchema>,
    form: UseFormReturn<z.infer<TSchema>>
  ) => void;
  schema?: TSchema;
  options?: UseFormProps<z.infer<TSchema>>;
};

export function Form<TSchema extends ZodObject<any>>({
  children,
  onSubmit,
  options,
  schema,
  ...props
}: FormProps<TSchema>) {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    ...options,
  });
  return (
    <FormProvider {...form}>
      <MUIForm
        onSubmit={form.handleSubmit((data) => onSubmit?.(data, form))}
        {...props}
      >
        {children?.(form)}
      </MUIForm>
    </FormProvider>
  );
}
