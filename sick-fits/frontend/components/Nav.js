import React from 'react'
import Link from 'next/link'

import User from './User'
import StyledNav from './styles/NavStyles'

const Nav = () => (
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
)

export default Nav
