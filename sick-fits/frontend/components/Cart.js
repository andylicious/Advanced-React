import React from 'react'
import { Query, Mutation } from 'react-apollo'

import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import { LOCAL_STATE_QUERY } from './graphql/queries'
import { TOGGLE_CART_MUTATION } from './graphql/mutations'

const Cart = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {(toggleCart) => (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <CartStyles open={data?.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="Close">
                &times;
              </CloseButton>
              <Supreme>Your cart</Supreme>
              <p>You have __ items in your cart</p>
            </header>
            <footer>
              <p>10.10$</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        )}
      </Query>
    )}
  </Mutation>
)

export default Cart
