import { NO_LAYOUT } from "../constants/layout";
import About from "../pages/about";
import Cart from "../pages/cart";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import UserInfo from "../pages/userInfo";

export const configRoutes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/home',
        component: Home,
        // layout: NO_LAYOUT,
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/cart',
        component: Cart,
        protected: true,
        rolePermissions: ['user', 'admin'],
    },
    {
        path: '/userInfo/:userId',
        component: UserInfo,
        protected: true,
        rolePermissions: ['admin', 'user'],
    },
    
]