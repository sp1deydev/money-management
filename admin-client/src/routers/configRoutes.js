import { NO_LAYOUT } from "../constants/layout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/login";
import Register from "../pages/register";
import UserInfo from "../pages/userInfo";

export const configRoutes = [
    {
        path: '/',
        component: Dashboard,
        protected: true,
        rolePermissions: ['user'],
    },
    {
        path: '/dashboard',
        component: Dashboard,
        protected: true,
        rolePermissions: ['user'],
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
        path: '/userInfo/:userId',
        component: UserInfo,
        protected: true,
        rolePermissions: ['user'],
    },
    
]