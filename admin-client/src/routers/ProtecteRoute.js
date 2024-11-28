import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    rolePermissions: PropTypes.array.isRequired,
};

function ProtectedRoute(props) {
    const currentUser = useSelector((state)=> state.user.currentUser) || {};
    const isLoading = useSelector((state)=> state.user.isLoading)
    const isRolePermissions = props.rolePermissions && props.rolePermissions.includes(currentUser?.role)
    const navigate = useNavigate();
    useEffect(()=> {
        if (Object.keys(currentUser).length === 0 && !isLoading) {
            toast.info('Please login first');
            navigate(`/login?redirect=${window.location.pathname}`)
        }
        //authorization 
        if (Object.keys(currentUser).length !== 0 && !isLoading && !isRolePermissions) {
            toast.error("Bạn không có quyền truy cập trang này");
            navigate("/");
        }
    }, [currentUser, navigate, isLoading]);
    return <Fragment>{currentUser && props.children}</Fragment>;
}

export default ProtectedRoute;