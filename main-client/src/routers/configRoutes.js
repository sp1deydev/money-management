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
        layout: NO_LAYOUT,
    },
    {
        path: '/register',
        component: Register,
        layout: NO_LAYOUT,
    },
    {
        path: '/cart',
        component: Cart,
        protected: true,
        rolePermissions: ['user'],
    },
    {
        path: '/userInfo/:userId',
        component: UserInfo,
        protected: true,
        rolePermissions: ['user'],
    },
    
]