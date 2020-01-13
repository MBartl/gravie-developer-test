import React, { Component, Fragment } from 'react'

import { Card, Icon } from 'semantic-ui-react'

class GameTiles extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
    this.props.setColumnCount(this.props.tColumns)
  }

  handleRent = (e) => {
    let game = e.target.parentElement.lastElementChild.innerText
    let image = e.target.parentElement.parentElement.firstElementChild.src

    this.props.addGame(game, image)
  }

  handleRemove = (e) => {
    let parent = e.target.parentElement
    let game

    e.target.parentElement.className === 'rentButton' ?
    game = parent.parentElement.lastElementChild.innerText :
    game = parent.lastElementChild.innerText

    this.props.remove(game)
  }

  render() {
    return (
      <Fragment>
        { this.props.games ? <Card.Group>
          {this.props.games ? this.props.games.map((game, i) => {
            let alt = `cover art for ${this.props.games[i]}`

            return (i+1 === this.props.column && i <= this.props.tColumns) ? <Card style={{alignSelf: 'center'}} key={i}>

              {
                (i === 0 && this.props.prevQueLoad === true) || (i+1 === this.props.tColumns && this.props.nextQueLoad === true) ?
                  <div style={{width: '12em', height: '12em'}}>
                    <Icon loading name='spinner' size='large' style={{color: 'black', marginTop: '3.75em', marginRight: '0.3em'}} />
                  </div>
                :
                <img src={this.props.images[i]} alt={alt} style={{width: '100%', minHeight: '10em'}}></img>
              }
              <div style={{textAlign: 'left'}}>

                <button className='rentButton'
                  disabled={this.props.cart.includes(game) && !this.props.displayCart === true}
                  onClick=
                  {
                    this.props.displayCart === true ?
                      this.handleRemove
                    :
                      this.handleRent
                  }>

                  {
                    !this.props.displayCart === true ?
                      this.props.cart.includes(game) ? '✔' : 'Rent'
                    :
                    <Icon name='trash alternate' size='small'/>
                  }
                </button>
                { this.props.displayCart === true ?
                  null
                :
                <p className='price'>$4.99</p>
                }

                <h4 className='gameTitle'>{game}</h4>

              </div>
            </Card> : null
          })
          :
            null
          }
        </Card.Group>
        :
          null
        }
      </Fragment>
    );
  }

}

export default GameTiles
