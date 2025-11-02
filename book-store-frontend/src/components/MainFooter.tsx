import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function MainFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Bookstore Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">B</span>
              </div>
              <span className="font-bold text-lg">BookHaven</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online bookstore. Discover new releases, bestsellers, and timeless classics delivered straight to your door.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm"><Facebook className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Twitter className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Instagram className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Youtube className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3>Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Info</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Returns</a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3>Book Categories</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fiction</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Non-Fiction</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Children's Books</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Science & Technology</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Comics & Graphic Novels</a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3>Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Join our newsletter to get updates on new arrivals, exclusive deals, and reading recommendations.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <Input placeholder="Enter your email" className="rounded-r-none" />
                <Button className="rounded-l-none"><Mail className="h-4 w-4" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and Terms.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© 2025 BookHaven. All rights reserved.</p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}