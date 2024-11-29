import {
  InfoCircleOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/emoney.png';
import { userSlice } from '../redux/userSlice';
import handleAuthToken from '../utils/handleAuthToken';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import { handleSessionStorage } from '../utils/handleSessionStorage';

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
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/users')}>
            Quản lý người dùng
          </Menu.Item>
          <Menu.Item key="5" icon={<InfoCircleOutlined />}  onClick={() => navigate(`/userInfo/${currentUser.id}`)}>
            Hồ sơ người dùng
          </Menu.Item>
          <Menu.Item key="11" icon={<LogoutOutlined />} danger>
            <Popconfirm
              title="Bạn có chắc chắn muốn đăng xuất?"
              onConfirm={handleLogout}
              okText="Đăng xuất"
              cancelText="Hủy"
            >
              <div style={{width:'100%'}}>
                Đăng xuất
              </div>
            </Popconfirm>
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
