import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY } from './graphql/queries'
import { REMOVE_FROM_CART_MUTATION } from './graphql/mutations'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.blue};
    cursor: pointer;
  }
`

const RemoveFromCart = ({ id }) => (
  <Mutation
    mutation={REMOVE_FROM_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(removeFromCart, { loading }) => (
      <BigButton
        disabled={loading}
        onClick={() => removeFromCart().catch((err) => alert(err.message))}
        title="Delete item"
      >
        &times;
      </BigButton>
    )}
  </Mutation>
)

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default RemoveFromCart
