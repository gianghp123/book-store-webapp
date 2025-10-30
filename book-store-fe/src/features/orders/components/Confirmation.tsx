"use client";

import React, { useEffect, useState } from "react"; // Thêm hook
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderResponse } from "../dtos/response/order-response.dto"; // Import kiểu
import { format } from "date-fns"; // Import hàm format ngày
import { Spinner } from "@/components/ui/spinner"; // Import Spinner

// Kiểu dữ liệu cho form đã lưu
interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  paymentMethod: 'new' | 'saved';
  zipCode: string;
}

interface OrderDetail {
  label: string;
  value: string;
}

// Xóa Props cũ vì chúng ta sẽ tự lấy dữ liệu
interface OrderConfirmation1Props {}

export function OrderConfirmation1({}: OrderConfirmation1Props) {
  // State để lưu dữ liệu lấy từ sessionStorage
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [form, setForm] = useState<PaymentFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ chạy ở client
    const orderData = sessionStorage.getItem('confirmationOrder');
    const formData = sessionStorage.getItem('confirmationForm');

    if (orderData && formData) {
      setOrder(JSON.parse(orderData));
      setForm(JSON.parse(formData));
    }
    setLoading(false);

    // (Tùy chọn) Xóa sessionStorage sau khi đã đọc
    // sessionStorage.removeItem('confirmationOrder');
    // sessionStorage.removeItem('confirmationForm');
  }, []);

  // Xử lý thông điệp và chi tiết đơn hàng
  const thankYouMessage = "Thanks for your order!";
  const orderProcessingMessage = "sẽ được xử lý trong 24 giờ. Chúng tôi sẽ thông báo cho bạn qua email khi đơn hàng được vận chuyển.";
  
  // Tạo chi tiết đơn hàng động
  const orderDetails: OrderDetail[] = [
    { 
      label: "Date", 
      value: order ? format(new Date(order.orderDate), 'dd MMMM yyyy') : "..." 
    },
    { 
      label: "Payment Method", 
      value: form?.paymentMethod === 'saved' ? "Thẻ đã lưu" : "Thẻ tín dụng mới"
    },
    { 
      label: "Name", 
      // Lấy tên từ form
      value: form?.cardholderName || "..."
    },
    { 
      label: "ZIP Code", 
      // Lấy zip từ form
      value: form?.zipCode || "..."
    },
    { 
      label: "Total Amount", 
      // Lấy tổng tiền từ order
      value: order ? `$${Number(order.totalAmount).toFixed(2)}` : "..."
    },
  ];

  const trackOrderButtonText = "Track your order";
  // Xóa biến 'returnToShoppingButtonText' vì không cần nữa

  // Hiển thị loading
  if (loading) {
    return (
      <section className="bg-background py-8 antialiased">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0 flex justify-center items-center h-60">
          <Spinner size = "lg" />
        </div>
      </section>
    );
  }

  // Hiển thị nếu không tìm thấy dữ liệu (ví dụ: refresh trang)
  if (!order || !form) {
    return (
      <section className="bg-background py-8 antialiased">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
            Không tìm thấy thông tin đơn hàng
          </h2>
          <p className="mb-6 text-muted-foreground md:mb-8">
            Có thể bạn đã tải lại trang. Vui lòng kiểm tra email hoặc lịch sử đơn hàng.
          </p>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <a href="/">Về trang chủ</a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị thông tin thành công
  return (
    <section className="bg-background py-8 antialiased">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
          {thankYouMessage}
        </h2>
        <p className="mb-6 text-muted-foreground md:mb-8">
          Đơn hàng của bạn{" "}
          <span className="font-medium text-foreground">
            {/* Lấy Order ID từ order */}
            #{order.id.split('-')[0]}... 
          </span>{" "}
          {orderProcessingMessage}
        </p>
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-6">
            {/* Dùng mảng orderDetails đã tạo động */}
            {orderDetails.map((detail, index) => (
              <dl
                key={index}
                className="mb-4 items-center justify-between gap-4 last:mb-0 sm:flex"
              >
                <dt className="mb-1 font-normal text-muted-foreground sm:mb-0">
                  {detail.label}
                </dt>
                <dd className="font-medium text-foreground sm:text-end">
                  {detail.value}
                </dd>
              </dl>
            ))}
          </CardContent>
        </Card>
        
        {/* *** BẮT ĐẦU SỬA LỖI *** */}
        <div className="flex items-center space-x-4">
          {/* 1. Sửa nút "Track your order" để trỏ về trang chủ "/" */}
          <Button asChild>
            <a href="/">{trackOrderButtonText}</a>
          </Button>
          
          {/* 2. Xóa nút "Return to shopping" */}
        </div>
        {/* *** KẾT THÚC SỬA LỖI *** */}
      </div>
    </section>
  );
}