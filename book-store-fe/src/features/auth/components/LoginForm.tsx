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
import { useLogin } from "@refinedev/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LoginDto } from "../dtos/request/login.dto";

const formSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate } = useLogin<LoginDto>();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    const loginDto: LoginDto = {
      email: values.email,
      password: values.password,
    };
    mutate(loginDto, {
      onSuccess: (data) => {
        setIsCreating(false);
        router.push(data.redirectTo || "/");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to login, please try again");
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
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and password to login
          </p>
        </div>

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
        {/* ... (Kết thúc FormField) ... */}

        <Button type="submit" disabled={isCreating}>
          {isCreating ? <Spinner className="mr-2" /> : "Login"}
        </Button>

        <FieldSeparator />

        <FormDescription className="text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign Up
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
