// src/features/auth/components/SignupForm.tsx
'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
// 1. Thay 'useCreate' bằng 'useRegister'
import { useRegister } from "@refinedev/core"
import { RegisterDto } from "../dtos/request/register.dto"
import { Spinner } from "@/components/ui/spinner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FieldSeparator } from "@/components/ui/field"
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Họ và tên là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phoneNumber: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
})

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isLoading: isCreating } = useRegister<RegisterDto>({
    
    onSuccess: (response) => {
      console.log("Đăng ký thành công (onSuccess callback):", response);
      toast.success("Đăng ký thành công! Đang chuyển hướng...");
    },
    onError: (err) => {
      console.error("Lỗi đăng ký (onError callback):", err);
      toast.error(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
  // Tạo object với snake_case để gửi đi
  const registerDto: RegisterDto = {
    full_name: values.fullName, // Sửa ở đây
    email: values.email,        // (email và password giữ nguyên)
    password: values.password,
    ...(values.phoneNumber && { phone_number: values.phoneNumber }), // Sửa ở đây
  }

    mutate(registerDto);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập thông tin của bạn dưới đây để tạo tài khoản
          </p>
        </div>

        {/* ... (Các FormField không thay đổi) ... */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
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
              <FormLabel>Số điện thoại (Tuỳ chọn)</FormLabel>
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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Phải có ít nhất 6 ký tự." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... (Kết thúc FormField) ... */}

        <Button type="submit" disabled={isCreating}>
          {isCreating && <Spinner className="mr-2" />}
          {isCreating ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
        
        <FieldSeparator />
        
        <FormDescription className="text-center">
          Đã có tài khoản?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Đăng nhập
          </Link>
        </FormDescription>
      </form>
    </Form>
  )
}