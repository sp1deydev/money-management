import React, { useState } from 'react';
import { Layout, Menu, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import { handleSessionStorage } from '../utils/handleSessionStorage';
import handleAuthToken from '../utils/handleAuthToken';
import { userSlice } from '../redux/userSlice';
import { toast } from 'react-toastify';
import {
  PieChartOutlined,
  WalletOutlined,
  TagsOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from '../assets/emoney.png';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser) || {};
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleLogout = () => {
    dispatch(userSlice.actions.setCurrentUser({}));
    handleAuthToken();
    handleLocalStorage.remove('access_token');
    handleSessionStorage.remove('access_token');
    navigate('/login');
    toast.success('Đăng xuất thành công!');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div
          className="logo"
          style={{ width: '200px', float: 'left', marginLeft: '24px' }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '200px',
              margin: '8px',
            }}
          />
        </div>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => navigate('/dashboard')}>
            Báo cáo tổng quan
          </Menu.Item>
          <Menu.Item key="10" icon={<DollarCircleOutlined />} onClick={() => navigate('/income')}>
            Quản lý thu nhập
          </Menu.Item>
          <Menu.Item key="2" icon={<WalletOutlined />} onClick={() => navigate('/outcome')}>
            Quản lý chi tiêu
          </Menu.Item>
          <Menu.Item key="9" icon={<TagsOutlined />} onClick={() => navigate('/goal')}>
            Mục tiêu tài chính
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />} onClick={() => navigate(`/userInfo/${currentUser.id}`)}>
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
        <Header className="site-layout-background" style={{ backgroundColor: '#fff', padding: 0 }} />
        <Content style={{ padding: '0 24px', backgroundColor: '#E8F5E9 ' }}>
          <div>{props.children}</div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#E8F5E9 ' }}>E-Money 2024</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
