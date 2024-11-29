import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import { configRoutes } from './configRoutes';
import ProtectedRoute from './ProtectedRoute';
import { NO_LAYOUT } from '../constants/layout';
import MainLayout from '../layouts/MainLayout';

Routers.propTypes = {
    
};

const layouts = {
  [NO_LAYOUT]: Fragment,
};

function Routers(props) {
    const routes = configRoutes
    return (
        <Routes>
            {routes.map((route, index) => {
                let Component = route.component;
                let Layout = layouts[route.layout] || MainLayout;
                if (route.protected) {
                  Component = (
                    <ProtectedRoute rolePermissions={route.rolePermissions}>
                      <Layout>
                        <route.component />
                      </Layout>
                    </ProtectedRoute>
                  );
                } else {
                  Component = (
                    <Layout>
                      <route.component />
                    </Layout>
                  );
                }

                return <Route key={index} path={route.path} element={Component} />;
            })}
        </Routes>
    );
}

export default Routers;