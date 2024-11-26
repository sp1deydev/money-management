import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Card, Row, Col } from 'antd';
// import logo from '../../assets/image/whitelogo.png'
import {
  PieChartOutlined,
  ShopOutlined,
  UserOutlined,
  TagsOutlined ,
  ShoppingOutlined,
  LogoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import { handleSessionStorage } from '../utils/handleSessionStorage';
import handleAuthToken from '../utils/handleAuthToken';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const handleLogout = () => {
    handleAuthToken();
    handleLocalStorage.remove('access_token');
    handleSessionStorage.remove('access_token');
    navigate('/admin/login');
    }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div
          className="logo"
          style={{ width: "200px", float: "left", marginLeft:'24px' }}
        >
          <img
            src={'logo'} // Replace with your logo image path
            alt="Logo"
            style={{
              width: "200px",
              marginTop:'8px'
            }}
          />
        </div>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="10" icon={<ShoppingOutlined />} onClick={() => navigate('/admin/purchase-order')}>
            Purchase Orders
          </Menu.Item>
          <Menu.Item key="2" icon={<ShopOutlined />} onClick={() => navigate('/admin/products')}>
            Products
          </Menu.Item>
          <Menu.Item key="9" icon={<TagsOutlined  />} onClick={() => navigate('/admin/categories')}>
            Categories
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate('/admin/users')}>
            Users
          </Menu.Item>
          <Menu.Item key="5" icon={<InfoCircleOutlined />}  onClick={() => navigate('/admin/profile')}>
            Profile
          </Menu.Item>
          <Menu.Item key="11" icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Log out
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ backgroundColor:'#fff',padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Overview</Breadcrumb.Item>
          </Breadcrumb> */}
          {/* <AdminBreadCrumbs /> */}
          <div>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Spidey Shop 2024</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
