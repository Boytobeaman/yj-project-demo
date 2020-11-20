import React, { Component } from "react";


class Index extends Component {
  render(){
    return(
      <div className="container not-found-wrap">
        <div className="text-center">
          <div className='rounded bg-white p-3'>
            <h1>404</h1>
            <h4>NOT FOUND</h4>
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Index