"use client";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@refinedev/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { RegisterDto } from "../dtos/request/register.dto";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email" }),
  phoneNumber: z.string().optional(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate } = useRegister<RegisterDto>();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    const registerDto: RegisterDto = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      ...(values.phoneNumber && { phoneNumber: values.phoneNumber }),
    };
    mutate(registerDto, {
      onSuccess: (data) => {
        toast.success(
          data.successNotification?.message || "Create account successfully"
        );
        setIsCreating(false);
        router.push(data.redirectTo || "/login");
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to create account, please try again"
        );
        setIsCreating(false);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your information below to create an account
          </p>
        </div>

        {/* ... (Các FormField không thay đổi) ... */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="At least 4 characters."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" disabled={isCreating}>
          {isCreating ? <Spinner className="mr-2" /> : "Sign Up"}
        </Button>

        <FieldSeparator />

        <FormDescription className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
