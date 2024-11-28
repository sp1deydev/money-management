import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Card, Row, Col } from 'antd';
import logo from '../assets/emoney.png'
import {
  PieChartOutlined,
  ShopOutlined,
  UserOutlined,
  TagsOutlined ,
  ShoppingOutlined,
  LogoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import { handleSessionStorage } from '../utils/handleSessionStorage';
import handleAuthToken from '../utils/handleAuthToken';
import { userSlice } from '../redux/userSlice';
import { toast } from 'react-toastify';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = (props) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser) || {};
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const handleLogout = () => {
    dispatch(userSlice.actions.setCurrentUser({}))
    handleAuthToken();
    handleLocalStorage.remove('access_token');
    handleSessionStorage.remove('access_token');
    navigate('/login');
    toast.success('Đăng xuất thành công!');
    }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div
          className="logo"
          style={{ width: "200px", float: "left", marginLeft:'24px' }}
        >
          <img
            src={logo} // Replace with your logo image path
            alt="Logo"
            style={{
              width: "200px",
              margin:'8px'
            }}
          />
        </div>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/dashboard')}>
            Quản lý người dùng
          </Menu.Item>
          <Menu.Item key="5" icon={<InfoCircleOutlined />}  onClick={() => navigate(`/userInfo/${currentUser.id}`)}>
            Hồ sơ người dùng
          </Menu.Item>
          <Menu.Item key="11" icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ backgroundColor:'#fff',padding: 0 }} />
        <Content style={{ padding: '0 24px', backgroundColor:'#E8F5E9 ' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Overview</Breadcrumb.Item>
          </Breadcrumb> */}
          {/* <AdminBreadCrumbs /> */}
          <div>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor:'#E8F5E9 ' }}>E-Money 2024</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
