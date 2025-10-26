import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { CartItem, CartResponse } from "../dtos/response/cart-response.dto";
import Link from "next/link";

interface Props {
  cartResponse: CartResponse;
  imageFallbackUrl: string;
}

const defaultProps: Props = {
  cartResponse: {
    id: "1",
    items: [
      {
        id: "1",
        product: {
          id: "1",
          title: "The Art of Clean Code: A Practical Guide",
          price: 1499,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "",
          rating: 0,
          ratingCount: 0,
          createdAt: "",
          updatedAt: "",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-2", name: "Software Engineering" },
          ],
          authors: [
            {
              id: "auth-1",
              name: "Robert C. Martin",
            },
          ],
        },
      },
      {
        id: "2",
        product: {
          id: "2",
          title:
            "A comprehensive introduction to modern JavaScript programming. Learn ES6+ features, async programming, and best practices for web development. Perfect for beginners who want to master JavaScript from the ground up.",
          price: 598,
          image:
            "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
          description: "",
          rating: 0,
          ratingCount: 0,
          createdAt: "",
          updatedAt: "",
          categories: [
            { id: "cat-1", name: "Programming" },
            { id: "cat-3", name: "Web Development" },
          ],
          authors: [{ id: "auth-2", name: "Sarah Chen" }],
        },
      },
    ],
    total: 2097,
    createdAt: "",
  },
  imageFallbackUrl:
    "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
};

const ShoppingCart1Page = ({ cartResponse, imageFallbackUrl }: Props) => {
  const subtotal = cartResponse.items.reduce(
    (acc, item) => acc + item.product.price,
    0
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartResponse.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24">
                  <Image
                    src={item.product.image || imageFallbackUrl}
                    alt={item.product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium">{item.product.title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {item.product.authors.map((author) => (
                      <Badge key={author.id} variant="outline">
                        {author.name}
                      </Badge>
                    ))}
                    {item.product.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <span className="font-bold text-lg">
                    ${item.product.price}
                  </span>
                  <Button variant="ghost" size="sm" className="relative">
                    <Trash2 className="size-6 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Discount</span>
                  <span>-$0</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${subtotal}</span>
                </div>
              </div>
              <Link href="/payment">
              <Button className="mt-4 w-full" size="lg">
                Proceed to Payment
              </Button>
              </Link>
              <Link href="/">
                <Button variant="link" className="mt-2 w-full">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-4">
              <h3 className="font-medium">
                Do you have a voucher or gift card?
              </h3>
              <div className="flex gap-2">
                <Input placeholder="Enter code" />
                <Button>Apply Code</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart1 = () => {
  return <ShoppingCart1Page {...defaultProps} />;
};

export { ShoppingCart1 };
