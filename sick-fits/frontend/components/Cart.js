import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { adopt } from 'react-adopt'

import calcTotalPrice from '../lib/calcTotalPrice'
import CartItem from './CartItem'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import formatMoney from '../lib/formatMoney'
import SickButton from './styles/SickButton'
import Supreme from './styles/Supreme'
import User from './User'
import TakeMyMoney from './TakeMyMoney'
import { LOCAL_STATE_QUERY } from './graphql/queries'
import { TOGGLE_CART_MUTATION } from './graphql/mutations'

/* eslint-disable */
const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})
/* eslint-enable */

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const me = user.data?.me
      if (!me) return null
      return (
        <CartStyles open={localState.data?.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="Close">
              &times;
            </CloseButton>
            <Supreme>Your cart</Supreme>
            <p>
              You have {me.cart.length} item
              {me.cart.length === 1 ? '' : 's'} in your cart
            </p>
          </header>
          <ul>
            {me.cart.map((cartItem) => (
              <CartItem
                key={cartItem.id}
                id={cartItem.id}
                item={cartItem.item}
                quantity={cartItem.quantity}
              />
            ))}
          </ul>
          <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}$</p>
            <TakeMyMoney>
              <SickButton>Checkout</SickButton>
            </TakeMyMoney>
          </footer>
        </CartStyles>
      )
    }}
  </Composed>
)

export default Cart
