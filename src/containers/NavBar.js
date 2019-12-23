import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

import { Link } from 'react-router-dom'

class NavBar extends Component {

  render() {
    return (
      <div id='navbar' style={{margin: '3em'}}>
        <Link to='/home' style={{float: 'left', marginRight: '5em', marginTop: '0.75em'}}>
          <button id='home'>Home</button>
        </Link>
        <Link to='/cart' id='cart'
          style={{float: 'right', marginLeft: '5em'}}>
          <Icon circular id='cartIcon' name='shopping cart' size='large'
            style={{backgroundColor: '#ffffff'}}/>
        </Link>
      </div>
    );
  }

}

export default NavBar
