import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import AddToCart from './AddToCart'
import DeleteItem from './DeleteItem'
import formatMoney from '../lib/formatMoney'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import Title from './styles/Title'

const Item = ({ item }) => (
  <ItemStyles>
    {item.image && <img src={item.image} alt={item.title} />}
    <Title>
      <Link
        href={{
          pathname: '/item',
          query: { id: item.id },
        }}
      >
        <a>{item.title}</a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(item.price)}</PriceTag>
    <p>{item.description}</p>

    <div className="buttonList">
      <Link
        href={{
          pathname: '/update',
          query: { id: item.id },
        }}
      >
        <a>Edit 🖋</a>
      </Link>
      <AddToCart id={item.id} />
      <DeleteItem id={item.id}>Delete</DeleteItem>
    </div>
  </ItemStyles>
)

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    largeImage: PropTypes.string,
    price: PropTypes.number,
  }),
}

export default Item
