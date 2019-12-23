import React, { Component } from 'react'
import './App.css'

import NavBar from './containers/NavBar'
import Body from './containers/Body'
import Cart from './containers/Cart'

import { Switch, Redirect, Route } from 'react-router-dom'

// import Cookies from 'universal-cookie'

class App extends Component {
  state = {
    cart: [],
    cartImg: []
  }

  // componentDidMount() {
  //   // get all cookies for games here
  // }

  addToCart = (game, image) => {
    let cart = this.state.cart
    let cartImg = this.state.cartImg

    // const cookies = new Cookies()
    // let i = this.state.cart.length
    // cookies.set(`game${i+1}`, `name: ${cart[i]}, img: ${cartImg[i]}`, { path: '/' })
    // console.log(cookies.get(`game${i+1}`))

    this.setState({
      cart: [...cart, game],
      cartImg: [...cartImg, image]
    })
  }

  removeFromCart = (game) => {
    let newCart = this.state.cart
    let newCartImg = this.state.cartImg

    let target = newCart.indexOf(game)

    newCart.splice(target, 1)

    newCartImg.splice(target, 1)

    this.setState({
      cart: newCart,
      cartImg: newCartImg
    })
  }

  // resets the entire cart --> only triggers after checkout
  emptyCart = () => {
    this.setState({
      cart: [],
      cartImg: []
    })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <NavBar />
          <Switch>
            <Route path='/home' render={() => <Body
              addGame={this.addToCart}
              cart={this.state.cart}/>}/>
            <Route path='/cart' render={() => <Cart
              cart={this.state.cart} cartImg={this.state.cartImg}
              addGame={this.addToCart} emptyCart={this.emptyCart}
              remove={this.removeFromCart}/>}/>
            <Redirect from='/' to='/home' />
          </Switch>
        </header>
      </div>
    );
  }
}

export default App
