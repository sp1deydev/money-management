import React from 'react';
import PropTypes from 'prop-types';
import { Oval } from 'react-loader-spinner';

Loading.propTypes = {
    
};

const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh", // Full viewport height
      width: "100%", // Full viewport width
      backgroundColor: "#E8F5E9", // Optional background color
    },
  };

function Loading(props) {
    return (
        (!props.secondLoading ?
            (<Oval
            visible={true}
            height={props.height ? props.height : "16"}
            width={props.width ? props.width : "16"}
            color={props.color}
            secondaryColor={props.bgColor}
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />) 
            :
            (<div style={styles.container}>
                <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>)
        )
    );
}

export default Loading;