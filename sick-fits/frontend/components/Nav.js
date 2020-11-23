import React from 'react'
import Link from 'next/link'

import User from './User'
import StyledNav from './styles/NavStyles'

export default function Nav() {
  return (
    <StyledNav>
      <User>
        {({ data }) => {
          console.log({ me: data?.me })
          return data?.me ? <p>{data.me.name}</p> : null
        }}
      </User>
      <Link href="/">
        <a>Shop</a>
      </Link>
      <Link href="/sell">
        <a>Sell</a>
      </Link>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
      <Link href="/orders">
        <a>orders</a>
      </Link>
      <Link href="/account">
        <a>Account</a>
      </Link>
    </StyledNav>
  )
}
