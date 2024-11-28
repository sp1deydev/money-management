import React, { useState, Fragment  } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { 
    HomeOutlined, 
    InfoCircleOutlined,
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    UserAddOutlined,
    SmileOutlined,
    FrownOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { userSlice } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import handleAuthToken from '../utils/handleAuthToken';
import { toast } from 'react-toastify';
import { handleSessionStorage } from '../utils/handleSessionStorage';

HeaderBar.propTypes = {
    
};

const { Header } = Layout;
const { SubMenu } = Menu;

function HeaderBar(props) {
    const currentUser = useSelector((state) => state.user.currentUser) || {};
    const isEmpty =  Object.keys(currentUser).length === 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleHome = () => {
       navigate('/home');  
    }
    const handleAbout = () => {
       navigate('/about');  
    }
    const handleCart = () => {
       navigate('/cart');  
    }
    const handleLogin = () => {
       navigate('/login');  
    }
    const handleRegister = () => {
       navigate('/register');  
    }
    const handleProfile = () => {
       navigate(`/userInfo/${currentUser.id}`);  
    }
    const handleLogout = () => {
        handleAuthToken();
        handleLocalStorage.remove('access_token');
        handleSessionStorage.remove('access_token');
        dispatch(userSlice.actions.removeCurrentUser());
        navigate('/home');
    }

    //declare menuItems to by pass children warning
    const menuItems = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: handleHome
        },
        {
            key: '2',
            icon: <InfoCircleOutlined />,
            label: 'About',
            onClick: handleAbout
        },
        {
            key: '8',
            icon: <ShoppingCartOutlined />,
            label: 'Cart',
            onClick: handleCart
        },
        {
            key: '3',
            icon: currentUser && !isEmpty ? <SmileOutlined /> : <FrownOutlined />,
            label: currentUser && !isEmpty ? 'Username' : 'Guest',
            children: currentUser && !isEmpty ? [
                {
                    key: '4',
                    icon: <UserOutlined />,
                    label: 'My Profile',
                    onClick: handleProfile
                },
                {
                    key: '5',
                    icon: <LogoutOutlined />,
                    label: 'Log Out',
                    onClick: handleLogout
                }
            ] : [
                {
                    key: '6',
                    icon: <LoginOutlined />,
                    label: 'Login',
                    onClick: handleLogin
                },
                {
                    key: '7',
                    icon: <UserAddOutlined />,
                    label: 'Register',
                    onClick: handleRegister
                }
            ]
        }
    ];
    return (
        <div>

        <Header style={{ background: '#fff', marginBottom: "24px" }}>
            <div className="logo" style={{ width: '120px', height: '31px', background: '#2412', margin: '16px 28px 16px 0', float: 'left' }} />

            <Menu
            theme="light"
            mode="horizontal"
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            items={menuItems}
        />
        </Header>
        </div>
    );
}

export default HeaderBar;