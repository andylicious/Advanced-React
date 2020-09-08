import React from 'react'

import Link from 'next/link'
import StyledNav from './styles/NavStyles'

export default function Nav() {
  return (
    <StyledNav>
      <Link href="/">
        <a>Home</a>
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
