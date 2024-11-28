import React from 'react';
import PropTypes from 'prop-types';
import { Oval } from 'react-loader-spinner';

Loading.propTypes = {
    
};

function Loading(props) {
    return (
        <Oval
        visible={true}
        height="16"
        width="16"
        color={props.color}
        secondaryColor={props.bgColor}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
    );
}

export default Loading;