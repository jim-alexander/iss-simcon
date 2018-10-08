import React from 'react'
import './index.css';

class Loader extends React.Component {
  render () {
    return(
      <div>
        <h1>loading</h1>
      <h4>When finished, entire site will be ready and new data will be loaded.</h4>
        <div className="loader"></div>
      </div>
    )
  }
}

export default Loader;
