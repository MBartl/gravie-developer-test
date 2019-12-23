import React, { Component, Fragment } from 'react'

import { Card, Icon } from 'semantic-ui-react'

class GameTiles extends Component {
  state = {
    loading: false
  }

  handleRent = (e) => {
    if (this.props.displayCart === true) {
      return
    }
    else {
      let game = e.target.parentElement.lastElementChild.innerText
      let image = e.target.parentElement.parentElement.firstElementChild.src

      this.props.addGame(game, image)
    }
  }

  handleRemove = (e) => {
    let game = e.target.parentElement.lastElementChild.innerText
    let target = this.props.games.indexOf(game)

    this.props.remove(target)
  }

  render() {
    return (
      <Fragment>
        { this.props.games ? <Card.Group>
          {this.props.games ? this.props.games.map((game, i) => {
            let alt = `cover art for ${this.props.games[i]}`

            return (i+1 === this.props.column && i <= this.props.tColumns) ? <Card style={{alignSelf: 'center'}} key={i}>
              <img src={this.props.images[i]} alt={alt} style={{width: '100%'}}></img>
              <div style={{textAlign: 'left'}}>

                <button className='rentButton'
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
