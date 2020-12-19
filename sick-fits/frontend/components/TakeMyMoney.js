import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import PropTypes from 'prop-types'
import NProgress from 'nprogress'
import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User from './User'
import { CURRENT_USER_QUERY } from './graphql/queries'
import { CREATE_ORDER_MUTATION } from './graphql/mutations'

const totalItems = (cart) =>
  cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)

const TakeMyMoney = ({ children }) => {
  const onToken = async (res, createOrder) => {
    console.log('On Token Called!')
    console.log(res.id)
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch((err) => {
      alert(err.message)
    })

    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    })
  }

  return (
    <User>
      {({ data: { me } }) => (
        <Mutation
          mutation={CREATE_ORDER_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {(createOrder) => (
            <StripeCheckout
              amount={calcTotalPrice(me.cart)}
              name="Sick Fits"
              description={`Order of ${totalItems(me.cart)} items!`}
              image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
              stripeKey="pk_test_51I02ACBVgpLJS4ZqPgc6gQNCeaoIwpE5zTdZBtddsYKEsYQHaDAb3tOaAHalniUZ2zWvMjB01YEmSni80yJ7OWu600GdZ9zt8m"
              currency="USD"
              email={me.email}
              token={(res) => onToken(res, createOrder)}
            >
              {children}
            </StripeCheckout>
          )}
        </Mutation>
      )}
    </User>
  )
}

TakeMyMoney.propTypes = {
  children: PropTypes.element,
}

export default TakeMyMoney
