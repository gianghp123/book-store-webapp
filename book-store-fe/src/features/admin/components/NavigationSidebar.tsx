"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X, LayoutDashboard, BookOpen, Users, FolderOpen, User, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function NavigationSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(["catalog", "sales"]);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
    },
    {
      id: "catalog",
      label: "Catalog Management",
      icon: BookOpen,
      children: [
        { id: "products", label: "Products", page: "products" },
        { id: "categories", label: "Categories", page: "categories" }
      ],
    },
    {
      id: "sales",
      label: "Sales & Orders",
      icon: ShoppingBag,
      children: [
        { id: "orders", label: "Orders", page: "orders" },
        { id: "carts", label: "Shopping Carts", page: "carts" },
      ],
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      page: "users",
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 lg:w-16"
        } overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center gap-2 ${isOpen ? "" : "lg:justify-center"}`}>
            <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
            {isOpen && <h2 className="truncate">Bookstore Admin</h2>}
          </div>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      isOpen ? "" : "lg:justify-center"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {expandedSections.includes(item.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {isOpen && expandedSections.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <button
                          onClick={() => router.push(`/admin/${child.page}`)}
                          key={child.id}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            pathname === `/admin/${child.page}`
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-sm">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push(`/admin/${item.page}`)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === `/admin/${item.page}`
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  } ${isOpen ? "" : "lg:justify-center"}`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
