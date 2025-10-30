"use client";

// 1. Imports: Thêm useRouter, useState và Spinner
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner"; 
// 2. Import kiểu OrderDetail từ file Confirmation
import { type OrderDetail } from "./Confirmation"; 

// ... (Các interface (SavedCard, OrderItem, v.v.) giữ nguyên) ...
interface SavedCard {
  cardType: string;
  lastFour: string;
  expiry: string;
  imageUrl: string;
}

interface OrderItem {
  name: string;
  description: string;
  imageUrl: string;
}

interface OrderSummary {
  subtotal: number;
  discount: {
    percentage: number;
    amount: number;
  };
  shipping: number;
  tax: {
    percentage: number;
    amount: number;
  };
  total: number;
  currency: string;
}

interface PaymentMethodImage {
  src: string;
  alt: string;
}

interface PaymentFormProps {
  title?: string;
  secureBadgeText?: string;
  creditCardTabLabel?: string;
  paypalTabLabel?: string;
  newPaymentMethodLabel?: string;
  savedCard?: SavedCard;
  cardholderNameLabel?: string;
  cardholderNamePlaceholder?: string;
  cardNumberLabel?: string;
  cardNumberPlaceholder?: string;
  expiryDateLabel?: string;
  expiryDatePlaceholder?: string;
  cvvLabel?: string;
  cvvPlaceholder?: string;
  zipCodeLabel?: string;
  zipCodePlaceholder?: string;
  promoCodeLabel?: string;
  promoCodePlaceholder?: string;
  applyButtonLabel?: string;
  paypalImageUrl?: string;
  paypalRedirectMessage?: string;
  continueWithPaypalButtonLabel?: string;
  orderSummaryTitle?: string;
  orderItem?: OrderItem;
  orderSummary?: OrderSummary;
  moneyBackGuaranteeMessage?: string;
  paymentMethodImages?: PaymentMethodImage[];
  securityFooterText?: string;
}

// 3. Định nghĩa key cho sessionStorage
export const CONFIRMATION_DATA_KEY = "orderConfirmationData";

const PaymentForm1 = ({
  title = "Complete Your Purchase",
  secureBadgeText = "Secure SSL Encryption",
  creditCardTabLabel = "Credit Card",
  paypalTabLabel = "PayPal",
  newPaymentMethodLabel = "Use new payment method",
  savedCard = {
    cardType: "Visa",
    lastFour: "4321",
    expiry: "12/25",
    imageUrl:
      "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
  },
  cardholderNameLabel = "Cardholder Name*",
  cardholderNamePlaceholder = "John Doe",
  cardNumberLabel = "Card Number*",
  cardNumberPlaceholder = "4242 4242 4242 4242",
  expiryDateLabel = "Expiration Date*",
  expiryDatePlaceholder = "MM/YY",
  cvvLabel = "CVV*",
  cvvPlaceholder = "•••",
  zipCodeLabel = "ZIP Code*",
  zipCodePlaceholder = "Enter ZIP code",
  promoCodeLabel = "Promo Code",
  promoCodePlaceholder = "Enter promo code",
  applyButtonLabel = "Apply",
  paypalImageUrl = "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
  paypalRedirectMessage = "You will be redirected to PayPal to complete your payment",
  continueWithPaypalButtonLabel = "Continue with PayPal",
  orderSummaryTitle = "Order Summary",
  orderItem = {
    name: "SERP Pro Studio Suite",
    description: "License x1",
    imageUrl:
      "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
  },
  orderSummary = {
    subtotal: 7999.0,
    discount: { percentage: 10, amount: 799.9 },
    shipping: 149.0,
    tax: { percentage: 8, amount: 588.65 },
    total: 7936.75,
    currency: "USD",
  },
  moneyBackGuaranteeMessage = "30-day money back guarantee. Cancel anytime.",
  paymentMethodImages = [
    {
      src: "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
      alt: "Visa",
    },
    {
      src: "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
      alt: "Mastercard",
    },
    {
      src: "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
      alt: "American Express",
    },
  ],
  securityFooterText = "Secured by Stripe • PCI DSS compliant • SERP LLC - United States",
}: PaymentFormProps) => {

  // 4. Thêm state cho router, loading và các trường form
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("John Doe"); // Lấy placeholder làm giá trị mặc định
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card"); // Thêm state cho phương thức thanh toán

  // 5. Cập nhật hàm xử lý thanh toán (mock)
  const handleMockPayment = (e: React.MouseEvent<HTMLButtonElement>, method: string) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // Cập nhật phương thức thanh toán dựa trên nút nào được nhấp
    setPaymentMethod(method);

    // Giả lập gọi API trong 1.5 giây
    setTimeout(() => {
      // ID đơn hàng giả lập
      const mockOrderId = "mock-order-12345"; 
      
      // 6. Tạo đối tượng dữ liệu để truyền
      const confirmationData: OrderDetail[] = [
        { label: "Date", value: new Date().toLocaleDateString() }, // Lấy ngày hiện tại
        { label: "Payment Method", value: method }, // Sử dụng phương thức thanh toán
        { label: "Name", value: cardholderName }, // Lấy từ state
        { label: "ZIP Code", value: zipCode }, // Lấy từ state (chỉ hiển thị nếu có)
        { label: "Phone", value: "+(123) 456 7890" }, // Dữ liệu mock
      ];

      // 7. Lưu vào sessionStorage
      try {
        // Lọc ra các chi tiết có giá trị
        const validData = confirmationData.filter(detail => detail.value);
        sessionStorage.setItem(CONFIRMATION_DATA_KEY, JSON.stringify(validData));
      } catch (error) {
        console.error("Could not save to sessionStorage", error);
      }
      
      // 8. Chuyển hướng đến trang xác nhận
      router.push(`/confirmation/${mockOrderId}`);
      
    }, 1500); 
  };


  return (
    <div>
      {/* ... (Phần tiêu đề giữ nguyên) ... */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <Info className="h-4 w-4" />
          {secureBadgeText}
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border">
          <CardContent className="pt-6">
            <Tabs defaultValue="card">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card" onClick={() => setPaymentMethod('Credit Card')}>{creditCardTabLabel}</TabsTrigger>
                <TabsTrigger value="paypal" onClick={() => setPaymentMethod('PayPal')}>{paypalTabLabel}</TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-6">
                <div className="space-y-6">
                  {/* ... (RadioGroup giữ nguyên) ... */}
                  <RadioGroup defaultValue="new" className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <label className="flex cursor-pointer items-center gap-4">
                        <RadioGroupItem value="new" id="new" />
                        <span className="text-sm font-medium text-foreground">
                          {newPaymentMethodLabel}
                        </span>
                      </label>
                    </div>
                    <div className="rounded-lg border p-4">
                      <label className="flex cursor-pointer items-center gap-4">
                        <RadioGroupItem value="saved" id="saved" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {savedCard.cardType} ending in {savedCard.lastFour}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expires {savedCard.expiry}
                          </p>
                        </div>
                        <Image
                          src={savedCard.imageUrl}
                          alt={savedCard.cardType}
                          width={40}
                          height={25}
                          className="ml-auto h-6 w-auto"
                        />
                      </label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{cardholderNameLabel}</Label>
                      {/* 9. Kết nối state với Input */}
                      <Input
                        id="name"
                        placeholder={cardholderNamePlaceholder}
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card">{cardNumberLabel}</Label>
                      <Input id="card" placeholder={cardNumberPlaceholder} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">{expiryDateLabel}</Label>
                        <Input
                          id="expiry"
                          placeholder={expiryDatePlaceholder}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">{cvvLabel}</Label>
                        <div className="relative">
                          <Input id="cvv" placeholder={cvvPlaceholder} />
                          <Info className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip">{zipCodeLabel}</Label>
                      {/* 10. Kết nối state với Input */}
                      <Input 
                        id="zip" 
                        placeholder={zipCodePlaceholder} 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo">{promoCodeLabel}</Label>
                      <div className="flex gap-2">
                        <Input id="promo" placeholder={promoCodePlaceholder} />
                        <Button variant="outline">{applyButtonLabel}</Button>
                      </div>
                    </div>

                    {/* 11. Cập nhật nút "Pay" */}
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={(e) => handleMockPayment(e, 'Credit Card')}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner className="mr-2" />
                      ) : (
                        `Pay $${orderSummary.total.toFixed(2)}`
                      )}
                    </Button>

                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paypal" className="mt-6">
                {/* 12. Cập nhật nút PayPal */}
                <div className="flex flex-col items-center space-y-6 py-8">
                  <Image
                    src={paypalImageUrl}
                    alt="PayPal"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <p className="text-center text-muted-foreground">
                    {paypalRedirectMessage}
                  </p>
                  
                  <Button 
                    className="w-full"
                    onClick={(e) => handleMockPayment(e, 'PayPal')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner className="mr-2" />
                    ) : (
                      continueWithPaypalButtonLabel
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ... (Phần Order Summary bên phải giữ nguyên) ... */}
        <Card className="border">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {orderSummaryTitle}
                </h3>
                <div className="flex items-center gap-4 border-b pb-4">
                  <Image
                    src={orderItem.imageUrl}
                    alt={orderItem.name}
                    width={64}
                    height={64}
                    className="rounded-lg border"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {orderItem.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderItem.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount ({orderSummary.discount.percentage}%)
                    </span>
                    <span className="text-emerald-600">
                      -${orderSummary.discount.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${orderSummary.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tax ({orderSummary.tax.percentage}%)
                    </span>
                    <span>${orderSummary.tax.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-t pt-4 font-medium">
                  <span>Total</span>
                  <div className="flex items-center gap-2">
                    <span>${orderSummary.total.toFixed(2)}</span>
                    <Badge variant="secondary">{orderSummary.currency}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-accent p-4">
                  <Info className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {moneyBackGuaranteeMessage}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4">
                  {paymentMethodImages.map((image, index) => (
                    <Image
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      width={48}
                      height={30}
                      className="h-8 w-auto grayscale hover:grayscale-0"
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  {securityFooterText}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { PaymentForm1 };