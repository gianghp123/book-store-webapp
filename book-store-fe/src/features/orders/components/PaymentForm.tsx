"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Info, Lock } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { orderService } from "../services/orderService";
import { CreateOrderDto } from "../dtos/request/order.dto";

interface SavedCard {
  cardType: string;
  lastFour: string;
  expiry: string;
  imageUrl: string;
}

interface PaymentFormProps {
  cartData: CartResponse;
  imageFallbackUrl: string;
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
  moneyBackGuaranteeMessage?: string;
  paymentMethodImages?: { src: string; alt: string }[];
  securityFooterText?: string;
}

type PaymentFormData = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  zipCode: string;
  paymentMethod: "new" | "saved";
};

const PaymentForm1 = ({
  cartData,
  imageFallbackUrl,
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
  moneyBackGuaranteeMessage = "30-day money back guarantee. Cancel anytime.",
  paymentMethodImages = [
    {
      src: "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
      alt: "Visa",
    },
  ],
  securityFooterText = "Secured by Stripe • PCI DSS compliant • SERP LLC - United States",
}: PaymentFormProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: "new",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      zipCode: "",
    },
  });

  const subtotal = useMemo(
    () =>
      cartData.items.reduce(
        (acc, item) => acc + (parseFloat(item.price as any) || 0),
        0
      ),
    [cartData.items]
  );

  const total = subtotal;

  const handlePayment = async (formData: PaymentFormData) => {
    setIsProcessing(true);

    const orderDto: CreateOrderDto = {
      items: cartData.items.map((item) => ({ productId: item.productId })),
    };

    try {
      const response = await orderService.createOrder(orderDto);

      if (response.success && response.data) {
        toast.success("Đặt hàng thành công!");
        sessionStorage.setItem("confirmationOrder", JSON.stringify(response.data));
        sessionStorage.setItem("confirmationForm", JSON.stringify(formData));
        router.push(`/confirmation/${response.data.id}`);
      } else {
        if (response.statusCode === 401) {
          toast.error("Bạn cần đăng nhập để thanh toán.");
          router.push("/login");
        } else {
          toast.error(response.message || "Tạo đơn hàng thất bại.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi khi thanh toán.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div>
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
                  <TabsTrigger value="card">{creditCardTabLabel}</TabsTrigger>
                  <TabsTrigger value="paypal">{paypalTabLabel}</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="mt-6" asChild>
                  <form
                    onSubmit={methods.handleSubmit(handlePayment)}
                    className="space-y-6"
                  >
                    <Controller
                      control={methods.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                        >
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
                      )}
                    />

                    <div className="space-y-4">
                      <Controller
                        control={methods.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label htmlFor="name">{cardholderNameLabel}</Label>
                            <Input id="name" placeholder={cardholderNamePlaceholder} {...field} />
                          </div>
                        )}
                      />

                      <Controller
                        control={methods.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label htmlFor="card">{cardNumberLabel}</Label>
                            <Input id="card" placeholder={cardNumberPlaceholder} {...field} />
                          </div>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={methods.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <div className="space-y-2">
                              <Label htmlFor="expiry">{expiryDateLabel}</Label>
                              <Input id="expiry" placeholder={expiryDatePlaceholder} {...field} />
                            </div>
                          )}
                        />
                        <Controller
                          control={methods.control}
                          name="cvv"
                          render={({ field }) => (
                            <div className="space-y-2">
                              <Label htmlFor="cvv">{cvvLabel}</Label>
                              <div className="relative">
                                <Input id="cvv" placeholder={cvvPlaceholder} {...field} />
                                <Info className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </div>
                          )}
                        />
                      </div>

                      <Controller
                        control={methods.control}
                        name="zipCode"
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label htmlFor="zip">{zipCodeLabel}</Label>
                            <Input id="zip" placeholder={zipCodePlaceholder} {...field} />
                          </div>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="promo">{promoCodeLabel}</Label>
                        <div className="flex gap-2">
                          <Input id="promo" placeholder={promoCodePlaceholder} />
                          <Button variant="outline" type="button">
                            {applyButtonLabel}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Spinner className="mr-2" /> : <Lock className="mr-2 h-4 w-4" />}
                      {isProcessing ? "Đang xử lý..." : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="paypal" className="mt-6">
                  <div className="flex flex-col items-center space-y-6 py-8">
                    <Image
                      src={paypalImageUrl}
                      alt="PayPal"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                    />
                    <p className="text-center text-muted-foreground">{paypalRedirectMessage}</p>
                    <Button className="w-full">{continueWithPaypalButtonLabel}</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {orderSummaryTitle} ({cartData.items.length} items)
                  </h3>

                  <div className="max-h-60 space-y-4 overflow-y-auto border-b pb-4">
                    {cartData.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="rounded-lg border object-contain"
                            fallbackSrc={imageFallbackUrl}
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="line-clamp-1 text-sm text-muted-foreground">
                            {item.authors?.map((a) => a.name).join(", ") || "Unknown Author"}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(parseFloat(item.price as any) || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-t pt-4 font-medium">
                    <span>Total</span>
                    <div className="flex items-center gap-2">
                      <span>${total.toFixed(2)}</span>
                      <Badge variant="secondary">USD</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-accent p-4">
                    <Info className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">{moneyBackGuaranteeMessage}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4">
                    {paymentMethodImages?.map((image, index) => (
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

                  <p className="text-xs text-muted-foreground">{securityFooterText}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FormProvider>
  );
};

export { PaymentForm1 };
