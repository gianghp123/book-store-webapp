"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { OrderResponse } from "../dtos/response/order-response.dto";

interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  paymentMethod: "new" | "saved";
  zipCode: string;
}

interface OrderDetail {
  label: string;
  value: string;
}

export function OrderConfirmation1() {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [form, setForm] = useState<PaymentFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderData = sessionStorage.getItem("confirmationOrder");
    const formData = sessionStorage.getItem("confirmationForm");
    if (orderData && formData) {
      setOrder(JSON.parse(orderData));
      setForm(JSON.parse(formData));
    }
    setLoading(false);
  }, []);

  const orderDetails: OrderDetail[] = [
    { label: "Date", value: order ? format(new Date(order.orderDate), "dd MMMM yyyy") : "..." },
    { label: "Payment Method", value: form?.paymentMethod === "saved" ? "Thẻ đã lưu" : "Thẻ tín dụng mới" },
    { label: "Name", value: form?.cardholderName || "..." },
    { label: "ZIP Code", value: form?.zipCode || "..." },
    { label: "Total Amount", value: order ? `$${Number(order.totalAmount).toFixed(2)}` : "..." },
  ];

  if (loading) {
    return (
      <section className="bg-background py-8 antialiased">
        <div className="mx-auto flex h-60 max-w-2xl items-center justify-center px-4 2xl:px-0">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!order || !form) {
    return (
      <section className="bg-background py-8 antialiased">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">Không tìm thấy thông tin đơn hàng</h2>
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

  return (
    <section className="bg-background py-8 antialiased">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">Thanks for your order!</h2>
        <p className="mb-6 text-muted-foreground md:mb-8">
          Đơn hàng của bạn{" "}
          <span className="font-medium text-foreground">#{order.id?.split("-")[0]}...</span>{" "}
          sẽ được xử lý trong 24 giờ. Chúng tôi sẽ thông báo cho bạn qua email khi đơn hàng được vận chuyển.
        </p>

        <Card className="mb-6 md:mb-8">
          <CardContent className="p-6">
            {orderDetails.map((detail, index) => (
              <dl key={index} className="mb-4 items-center justify-between gap-4 last:mb-0 sm:flex">
                <dt className="mb-1 font-normal text-muted-foreground sm:mb-0">{detail.label}</dt>
                <dd className="font-medium text-foreground sm:text-end">{detail.value}</dd>
              </dl>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4">
          <Button asChild>
            <a href="/">Track your order</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
