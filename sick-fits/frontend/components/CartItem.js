import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import formatMoney from '../lib/formatMoney'
import RemoveFromCart from './RemoveFromCart'

const StyledCartItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`

const CartItem = ({ id, item, quantity }) => {
  if (!item) return null

  const { image, price, title } = item

  return (
    <StyledCartItem>
      <img width="100" src={image} alt={title} />
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(price * quantity)}
          {' - '}
          <em>
            {quantity} &times; {formatMoney(price)}
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </StyledCartItem>
  )
}

CartItem.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.shape({
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number,
    title: PropTypes.string.isRequired,
  }).isRequired,
  quantity: PropTypes.number,
}

export default CartItem
