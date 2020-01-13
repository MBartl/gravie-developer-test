import React, { Component, Fragment } from 'react'

// import { GIANT_BOMB } from '../constants'
import GameTiles from '../components/GameTiles'
import { Pagination, Grid, Segment, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Body extends Component {
  state = {
    games: [],
    images: [],
    search: '',
    loading: false,
    searched: false,
    prevQueLoad: false,
    nextQueLoad: false,
    columns: 0,
    searchedTextFile: ''
  }

  // add name and image to cart (in App state arrays)
  addGame = (event) => {
    let name = event.target.parentElement.children[2].innerText
    let image = event.target.parentElement.firstElementChild.src

    this.props.addToCart(name, image)
  }

  // handles search terms
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // checks for enter key pressed (alternative to search button)
  checkEnter = (e) => {
    let key = e.key
    if (key === 'Enter') {
      let search = this.state.search
      this.handleFetch(search)
    }
  }

  // fetch game list
  handleFetch = (search) => {
    this.setState({loading: true, searched: true})
    let terms
    typeof(search) === 'object' ? terms = this.state.search
    :
    terms = search

    this.setState({
      games: [],
      images: []
    })

    fetch(this.getUrl(terms))
    .then(res => res.json())
    .then(data => {
      let newGames = data.results.map(game => game.name)
      let images = data.results.map(game => game.image.medium_url)

      // set the fetched data as two parallel arrays
      this.setState({
        games: [...newGames],
        images: [...images],
        loading: false,
        prevQueLoad: false,
        nextQueLoad: false
      })
    })
  }

  getUrl = (terms) => {
    // Proxy URL required due to CORS restriction
    const proxyurl = `https://cors-anywhere.herokuapp.com/`

    // const url = `https://www.giantbomb.com/api/search/?api_key=${GIANT_BOMB}&format=json&query=${terms.toLowerCase()}&resources=game`

    if (!terms) {terms = this.state.search}

    const url = `https://www.giantbomb.com/api/search/?api_key=f876731fdb2f8aa7f2304a0d4b7efd0db47a20ce&format=json&query=${terms.toLowerCase()}&resources=game`

    return proxyurl + url
  }

  // just a simple alert now --> could plug in a payment service i.e. Stripe
  handleCheckout = () => {
    alert('Thanks for shopping with us!')

    this.props.emptyCart()
  }

  // if the mode is set to displaying a customer's cart then reset the state to the cart info from App.js file
  componentDidMount() {
    if (this.props.displayCart === true) {
        this.setState({
          games: this.props.cart,
          images: this.props.cartImg
        })
    }

    // this.readSearchTextFile()
  }

  // transforms the arrays based on left or right button
  scroll = (target) => {
    let direction = target.className.includes('right') ? 0 : this.state.games.length-1

    let newGames = this.state.games
    let gameToMove = newGames.splice(direction, 1)[0]

    let newImages = this.state.images
    let imageToMove = newImages.splice(direction, 1)[0]

    direction === 0 ? newGames.push(gameToMove) && newImages.push(imageToMove) :  newGames.unshift(gameToMove) && newImages.unshift(imageToMove)

    this.setState({
      games: newGames,
      images: newImages
    })

    this.scrollTarget(target, newGames)
  }

  setColumnCount = (num) => {
    this.setState({
      columns: num
    })
  }

  scrollTarget = (target, newGames) => {
    target.name === 'next' || target.parentElement.name === 'next' ? this.nextQueLoad(newGames[this.state.columns]) : this.prevQueLoad(newGames[0])
  }

  // Buffer change in picture
  prevQueLoad = (name) => {
    this.setState({
      prevQueLoad: true
    })

    this.fetchNewImage(name)
  }

  nextQueLoad = (name) => {
    this.setState({
      nextQueLoad: true
    })

    this.fetchNewImage(name)
  }

  fetchNewImage = (gameName) => {
    fetch(this.getUrl(gameName))
    .then(() => {
      this.setState({
        prevQueLoad: false,
        nextQueLoad: false
      })
    })
  }

  getRentalPeriod = () => {
    let period = new Date()
    period.setDate(period.getDate() + 7)
    let dateMonthYear = period.toString().split(' ').splice(1, 3)
    dateMonthYear[1] += ','
    dateMonthYear = dateMonthYear.join(' ')
    return dateMonthYear
  }

  /* Proof of concept for reading to a text file in React.
  Text files can be read from but not written to. Public text files will bundle with the rest of the JavaScript in browser but cannot be written to since they're not hosted anywhere.
  Better explanation here:
  https://stackoverflow.com/questions/49491710/can-reactjs-write-into-file

  Possible workarounds here:
  https://stackoverflow.com/questions/49023015/how-to-create-and-update-a-text-file-using-react-js

  readSearchTextFile = () => {
    fetch('../sumSearches.txt')
    .then(res => res.text())
    .then(text => {
      console.log(text)
      this.setState({
        searchedTextFile: text
      })
    })
  }
  */

  render() {
    let length
    this.state.games ? length = this.state.games.length : length = 0
    let searched = this.state.searched

    // for the purposes of having some price to display game rentals are set at $4.99 for a 1 week rental --> could add to this with varying rental periods and adjusted rates
    let primary = (length*4.99).toFixed(2)
    let tax = (Math.round(primary*.08025 * 100) / 100).toFixed(2)

    let total = (parseFloat(primary) + parseFloat(tax)).toFixed(2)

    // quick date math to display a 7 day rental period
    let rentalPeriod = this.getRentalPeriod()

    return (
      <Fragment>
        {
          this.props.displayCart === true ?
            null
          :

          <div style={{marginBottom: '3em'}}>
            <input type='text' id='searchbar' name='search' value={this.state.search} onChange={this.handleChange} onKeyDown={this.checkEnter} />
            <input type='button' id='search' value='Search' onClick={this.handleFetch} />
          </div>
        }
        {
          length > 0 && !this.props.displayCart === true ? <p style={{minWidth: '100%', textAlign: 'end', marginBottom: 0,
          paddingRight: '2em'}}>{`${length} results`}</p>
          :
            null
        }
        {
          length > 0 && this.props.displayCart === true ? <p style={{minWidth: '100%', textAlign: 'end', marginBottom: 0,
          paddingRight: '2em'}}>{`${length} items in cart`}</p>
          :
            null
        }

        <div id='gamesBanner'>
          {
            this.state.loading ?
              <Icon loading name='spinner' size='big' /> : null
          }
          {
            length > 0 ? <Fragment>
              <Grid style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible', alignItems: 'center',}}>

                <button name='prev' style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible', borderRadius: '2em', padding: 0}} className='scrollIcon l'>
                  <Icon name='angle double left' size='big'
                    onClick={(e) => this.scroll(e.target)} style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible', padding: 0}} />
                </button>

                <Grid.Row columns={2} only='mobile' style={{alignItems: 'center', maxWidth: '76%'}}>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={1} tColumns={2} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={2} tColumns={2} />
                    </Segment>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={4} only='computer' style={{alignItems: 'center', maxWidth: '76%'}}>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images} nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={1} tColumns={4} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={2} tColumns={4} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={3} tColumns={4} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images} nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={4} tColumns={4} />
                    </Segment>

                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3} only='tablet' style={{alignItems: 'center', maxWidth: '76%'}}>
                  <Grid.Column>

                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={1} tColumns={3} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={2} tColumns={3} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment style={{backgroundColor: '#282c34'}}>
                      <GameTiles games={this.state.games} images={this.state.images}  nextQueLoad={this.state.nextQueLoad} prevQueLoad={this.state.prevQueLoad}
                        setColumnCount={this.setColumnCount} displayCart={this.props.displayCart} remove={this.props.remove} addGame={this.props.addGame} cart={this.props.cart} column={3} tColumns={3} />
                    </Segment>

                  </Grid.Column>
                </Grid.Row>

                <button name='next' style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible', borderRadius: '2em', padding: 0}} className='scrollIcon'>
                  <Icon name='angle double right' size='big'
                    onClick={(e) => this.scroll(e.target)}
                    style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible', padding: 0, paddingLeft: '0.15em'}} />
                </button>

              </Grid>

              <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                totalPages={3}
                // style={{visibility: !this.state.games && length === 0 ? 'hidden' : 'visible'}}
                style={{visibility: 'hidden'}}
                id='pagination'
              />
            </Fragment>
            :
            null
          }
          {
            length === 0 && searched && !this.state.loading ?
              <h2>No Results Found</h2>
            :
              null
          }
          {
            this.props.displayCart === true && length === 0 ?
              <h2>No Items in Cart</h2>
            :
            this.props.displayCart === true && length > 0 ?
              <div style={{width: 'max-content', maxWidth: '70%', marginLeft: '33%', marginRight: '30%'}}>
                <hr />
                <p style={{lineHeight: '2em', margin: '0.15em'}}>
                  <span style={{float: 'left'}}>{`${length} games at $4.99 each: `}</span>
                  <span style={{float: 'right'}}>{`$${primary}`}</span>
                  <br />
                  <span style={{float: 'left'}}>{`Tax (8.025%)`}</span>
                  <span style={{float: 'right', textDecoration: 'underline'}}>{`$${tax}`}</span>
                  <br />
                  <span style={{float: 'right', maxWidth: '40%'}}>
                    {`Total: $${total}`}
                  </span>
                  <br />
                  <span style={{float: 'right'}}>{`Your rental period will end ${rentalPeriod}`}</span>
                  <br />
                </p>
                <Link to='/home'>
                  <button style={{float: 'right', marginBottom: '2em'}} onClick={this.handleCheckout} id='checkout'>Checkout</button>
                </Link>
              </div>
            :
            null
          }
        </div>
      </Fragment>
    );
  }

}

export default Body
