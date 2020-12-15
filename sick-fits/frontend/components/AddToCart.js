import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { ADD_TO_CART_MUTATION } from './graphql/mutations'
import { CURRENT_USER_QUERY } from './graphql/queries'

const AddToCart = ({ id }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(addToCart, { loading }) => (
      <button disabled={loading} onClick={addToCart}>
        Add{loading && 'ing'} to cart 🛒
      </button>
    )}
  </Mutation>
)

AddToCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default AddToCart
