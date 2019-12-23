import React, { Component } from 'react'

import Body from './Body'

class Cart extends Component {
  // the cart is just a reused search result with slight props adjustments

  render() {
    return (
      <div style={{minWidth: '100%'}}>
        <Body cart={this.props.cart} cartImg={this.props.cartImg}
          remove={this.props.remove} emptyCart={this.props.emptyCart}
          displayCart={true} />
      </div>
    );
  }

}

export default Cart
