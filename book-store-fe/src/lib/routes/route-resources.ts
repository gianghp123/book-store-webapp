export const resource = [
    {
        name: "products",
        list: "/",
        show: "/product/:id",
    },
    {
        name: "categories",
        list: "/categories",
    },
    {
        name: "orders",
        show: "payment"
    },
    {
        name: "carts",
        show: "/cart"
    },
]

export const adminResources = [
    {
        name: "dashboard",
        list: "/admin/dashboard",
    },
    {
        name: "users",
        list: "/admin/users",
        show: "/admin/users/:id"
    },
    {
        name: "products",
        list: "/admin/products",
        show: "/admin/products/:id"
    },
    {
        name: "categories",
        list: "/admin/categories",
        show: "/admin/categories/:id"
    },
    {
        name: "orders/admin",
        list: "/admin/orders",
        show: "/admin/orders/:id"
    },
    {
        name: "carts/admin",
        list: "/admin/carts",
        show: "/admin/carts/:id"
    }
]