import React from 'react'
import { Query, Mutation } from 'react-apollo'

import calcTotalPrice from '../lib/calcTotalPrice'
import CartItem from './CartItem'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import formatMoney from '../lib/formatMoney'
import SickButton from './styles/SickButton'
import Supreme from './styles/Supreme'
import User from './User'
import { LOCAL_STATE_QUERY } from './graphql/queries'
import { TOGGLE_CART_MUTATION } from './graphql/mutations'

const Cart = () => (
  <User>
    {({ data }) => {
      if (!data?.me) return null
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {(toggleCart) => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data: localStateData }) => (
                <CartStyles open={localStateData?.cartOpen}>
                  <header>
                    <CloseButton onClick={toggleCart} title="Close">
                      &times;
                    </CloseButton>
                    <Supreme>Your cart</Supreme>
                    <p>
                      You have {data?.me.cart.length} item
                      {data?.me.cart.length === 1 ? '' : 's'} in your cart
                    </p>
                  </header>
                  <ul>
                    {data.me.cart.map((cartItem) => (
                      <CartItem
                        key={cartItem.id}
                        id={cartItem.id}
                        item={cartItem.item}
                        quantity={cartItem.quantity}
                      />
                    ))}
                  </ul>
                  <footer>
                    <p>{formatMoney(calcTotalPrice(data.me.cart))}$</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }}
  </User>
)

export default Cart
