"use client";

// 1. Import thêm useEffect, useState, và useRouter
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// 2. Import key từ PaymentForm (đảm bảo đường dẫn chính xác)
import { CONFIRMATION_DATA_KEY } from "./PaymentForm"; 

export interface OrderDetail {
  label: string;
  value: string;
}

interface OrderConfirmation1Props {
  thankYouMessage?: string;
  orderProcessingMessage?: string;
  orderNumber?: string;
  orderDetails?: OrderDetail[]; 
  trackOrderButtonText?: string;
  returnToShoppingButtonText?: string; // Prop này vẫn ở đây nhưng không được dùng
}

const defaultOrderDetails: OrderDetail[] = [
  { label: "Date", value: "14 May 2024" },
  { label: "Payment Method", value: "JPMorgan monthly installments" },
  { label: "Name", value: "SERP Studios LLC" },
  {
    label: "Address",
    value: "34 Scott Street, San Francisco, California, USA",
  },
  { label: "Phone", value: "+(123) 456 7890" },
];

export function OrderConfirmation1({
  thankYouMessage = "Thanks for your order!",
  orderProcessingMessage = "will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.",
  orderNumber = "#7564804",
  orderDetails = defaultOrderDetails, 
  trackOrderButtonText = "Return Home",
  // Prop 'returnToShoppingButtonText' không còn được sử dụng
}: OrderConfirmation1Props) {
  
  const [detailsToDisplay, setDetailsToDisplay] = useState(orderDetails);
  const router = useRouter(); // 3. Khởi tạo router

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const data = sessionStorage.getItem(CONFIRMATION_DATA_KEY);
        
        if (data) {
          const parsedData: OrderDetail[] = JSON.parse(data);
          setDetailsToDisplay(parsedData); 
          sessionStorage.removeItem(CONFIRMATION_DATA_KEY);
        }
        
      } catch (error) {
        console.error("Failed to read from sessionStorage", error);
        setDetailsToDisplay(orderDetails);
      }
    }
  }, [orderDetails]); 

  // 4. Hàm điều hướng về trang chủ
  const handleTrackOrderClick = () => {
    router.push("/"); // Điều hướng về "/"
  };

  return (
    <section className="bg-background py-8 antialiased">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
          {thankYouMessage}
        </h2>
        <p className="mb-6 text-muted-foreground md:mb-8">
          Your order{" "}
          <a href="#" className="font-medium text-foreground hover:underline">
            {orderNumber}
          </a>{" "}
          {orderProcessingMessage}
        </p>
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-6">
            {detailsToDisplay.map((detail, index) => (
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
        <div className="flex items-center space-x-4">
          {/* 5. Cập nhật nút này */}
          <Button onClick={handleTrackOrderClick}>{trackOrderButtonText}</Button>
          
          {/* 6. Xóa nút "Return to shopping" */}
          {/* <Button variant="outline">{returnToShoppingButtonText}</Button> */}
        </div>
      </div>
    </section>
  );
}