import { ProductDetail } from "@/features/products/components/ProductDetail";
import {
  Product,
  ProductReview,
} from "@/features/products/dtos/response/product-response.dto";

const mockDetailedProducts: Product[] = [
  {
    id: "1",
    title: "The Art of Clean Code: A Practical Guide",
    description:
      "Master the principles of writing clean, maintainable, and elegant code. This comprehensive guide explores best practices, design patterns, and real-world examples to help you become a better developer. Learn how to write code that not only works but is also a pleasure to read and maintain. Covering topics from naming conventions to architecture design, this book is essential for any serious programmer.",
    price: 45.99,
    rating: 4.8,
    ratingCount: 234,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
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
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=800&fit=crop",
  },
  {
    id: "2",
    title: "Modern JavaScript for Beginners",
    description:
      "A comprehensive introduction to modern JavaScript programming. Learn ES6+ features, async programming, and best practices for web development. Perfect for beginners who want to master JavaScript from the ground up.",
    price: 34.99,
    rating: 4.6,
    ratingCount: 189,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-10-21T00:00:00Z",
    categories: [
      { id: "cat-1", name: "Programming" },
      { id: "cat-3", name: "Web Development" },
    ],
    authors: [{ id: "auth-2", name: "Sarah Chen" }],
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop",
  },
  {
    id: "3",
    title: "Design Patterns: Elements of Reusable Software",
    description:
      "The classic book on design patterns that every software developer should read. Learn the 23 gang of four patterns and how to apply them in real-world scenarios.",
    price: 52.99,
    rating: 4.9,
    ratingCount: 456,
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2024-10-15T00:00:00Z",
    categories: [
      { id: "cat-1", name: "Programming" },
      { id: "cat-2", name: "Software Engineering" },
    ],
    authors: [
      { id: "auth-3", name: "Erich Gamma" },
      { id: "auth-4", name: "Richard Helm" },
      { id: "auth-5", name: "Ralph Johnson" },
      { id: "auth-6", name: "John Vlissides" },
    ],
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop",
  },
  {
    id: "4",
    title: "React Hooks in Action",
    description:
      "Master React Hooks with this hands-on guide. Build modern React applications using hooks for state management, side effects, and more. Includes real-world examples and best practices.",
    price: 39.99,
    rating: 4.7,
    ratingCount: 312,
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-10-18T00:00:00Z",
    categories: [
      { id: "cat-1", name: "Programming" },
      { id: "cat-3", name: "Web Development" },
    ],
    authors: [{ id: "auth-7", name: "John Larsen" }],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
  },
  {
    id: "5",
    title: "TypeScript Essentials",
    description:
      "Everything you need to know about TypeScript. From basic types to advanced generics, this book covers it all. Learn how to build type-safe applications with confidence.",
    price: 42.99,
    rating: 4.5,
    ratingCount: 267,
    createdAt: "2024-01-30T00:00:00Z",
    updatedAt: "2024-10-22T00:00:00Z",
    categories: [
      { id: "cat-1", name: "Programming" },
      { id: "cat-3", name: "Web Development" },
    ],
    authors: [{ id: "auth-8", name: "Dan Vanderkam" }],
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=800&fit=crop",
  },
];

export const mockReviews: Record<string, ProductReview[]> = {
  "1": [
    {
      username: "CodeMaster42",
      rating: 5,
      comment:
        "This book completely changed how I approach writing code. The examples are practical and the explanations are crystal clear. Highly recommend!",
      createdAt: new Date("2024-10-15T00:00:00Z"),
    },
    {
      username: "DevNinja",
      rating: 5,
      comment:
        "A must-read for any serious developer. The principles outlined here have made my code so much more maintainable.",
      createdAt: new Date("2024-10-10T00:00:00Z"),
    },
    {
      username: "JSExpert",
      rating: 4,
      comment:
        "Great book overall, though some examples could be more modern. Still, the core principles are timeless.",
      createdAt: new Date("2024-10-05T00:00:00Z"),
    },
    {
      username: "SoftwareEngineer23",
      rating: 5,
      comment:
        "I've been programming for 10 years and this book still taught me new things. The chapter on naming conventions alone is worth the price.",
      createdAt: new Date("2024-09-28T00:00:00Z"),
    },
    {
      username: "BeginnerCoder",
      rating: 4,
      comment:
        "As a junior developer, this book was exactly what I needed. Some parts were challenging but worth pushing through.",
      createdAt: new Date("2024-09-20T00:00:00Z"),
    },
  ],
  "2": [
    {
      username: "WebDevPro",
      rating: 5,
      comment:
        "Perfect introduction to modern JavaScript. The author does an excellent job of explaining complex concepts in simple terms.",
      createdAt: new Date("2024-10-12T00:00:00Z"),
    },
    {
      username: "LearningToCode",
      rating: 5,
      comment:
        "I tried several JavaScript books and this one finally made everything click. The examples are great!",
      createdAt: new Date("2024-10-08T00:00:00Z"),
    },
    {
      username: "ReactDev",
      rating: 4,
      comment:
        "Good coverage of ES6+ features. Would have liked more on async/await but overall very solid.",
      createdAt: new Date("2024-09-30T00:00:00Z"),
    },
  ],
  "3": [
    {
      username: "ArchitectGuru",
      rating: 5,
      comment:
        "The definitive guide on design patterns. Every pattern is explained with clarity and real-world examples.",
      createdAt: new Date("2024-10-01T00:00:00Z"),
    },
    {
      username: "SeniorDev",
      rating: 5,
      comment:
        "A classic that stands the test of time. I refer back to this book constantly.",
      createdAt: new Date("2024-09-25T00:00:00Z"),
    },
  ],
  "4": [
    {
      username: "ReactFanatic",
      rating: 5,
      comment:
        "Hooks finally make sense! This book covers everything from useState to custom hooks brilliantly.",
      createdAt: new Date("2024-10-14T00:00:00Z"),
    },
    {
      username: "FrontendDev",
      rating: 4,
      comment:
        "Really helpful for understanding hooks. The performance optimization chapter is gold.",
      createdAt: new Date("2024-10-07T00:00:00Z"),
    },
  ],
  "5": [
    {
      username: "TypeScriptLover",
      rating: 5,
      comment:
        "This book helped me transition from JavaScript to TypeScript smoothly. The generic types section is excellent.",
      createdAt: new Date("2024-10-16T00:00:00Z"),
    },
    {
      username: "FullStackDev",
      rating: 4,
      comment:
        "Comprehensive coverage of TypeScript. Great for both beginners and intermediate developers.",
      createdAt: new Date("2024-10-09T00:00:00Z"),
    },
  ],
};

export default function ProductDetailPage() {
  return (
    <ProductDetail
      product={mockDetailedProducts[0]}
      reviews={mockReviews[mockDetailedProducts[0].id] || []}
      relatedProducts={mockDetailedProducts}
    />
  );
}
