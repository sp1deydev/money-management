import { NO_LAYOUT } from "../constants/layout";
import Login from "../pages/login";
import Register from "../pages/register";
import UserInfo from "../pages/userInfo";
import Users from "../pages/Users";

export const configRoutes = [
    {
        path: '/',
        component: Users,
        protected: true,
        rolePermissions: ['admin'],
    },
    {
        path: '/users',
        component: Users,
        protected: true,
        rolePermissions: ['admin'],
    },
    {
        path: '/login',
        component: Login,
        layout: NO_LAYOUT,
    },
    {
        path: '/userInfo/:userId',
        component: UserInfo,
        protected: true,
        rolePermissions: ['admin'],
    },
    
]