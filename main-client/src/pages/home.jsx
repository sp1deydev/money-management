import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/loading';

Home.propTypes = {
    
};

function Home(props) {
    return (
        <div>
            <Loading 
            color="#1677ff"
            bgColor="#fff"
            />
        </div>
    );
}

export default Home;