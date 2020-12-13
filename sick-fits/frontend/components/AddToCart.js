import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { ADD_TO_CART_MUTATION } from './graphql/mutations'

const AddToCart = ({ id }) => (
  <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
    {(addToCart) => <button onClick={addToCart}>Add to cart 🛒</button>}
  </Mutation>
)

AddToCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default AddToCart
