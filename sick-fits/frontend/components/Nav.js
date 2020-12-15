import React from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'

import CartCount from './CartCount'
import calculateCartItemCount from '../lib/calculateCartItemCount'
import User from './User'
import StyledNav from './styles/NavStyles'
import Signout from './Signout'
import { TOGGLE_CART_MUTATION } from './graphql/mutations'

const Nav = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {(toggleCart) => (
      <User>
        {({ data }) => (
          <StyledNav>
            <Link href="/">
              <a>Shop</a>
            </Link>
            {data?.me && (
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                <Link href="/orders">
                  <a>orders</a>
                </Link>
                <Link href="/account">
                  <a>Account</a>
                </Link>
                <Signout />
                <button onClick={toggleCart}>
                  My cart
                  <CartCount count={calculateCartItemCount(data.me.cart)} />
                </button>
              </>
            )}
            {!data?.me && (
              <Link href="/signup">
                <a>Signup</a>
              </Link>
            )}
          </StyledNav>
        )}
      </User>
    )}
  </Mutation>
)

export default Nav
