import React from 'react'
import PropTypes from 'prop-types'
import SingleItem from '../components/SingleItem'

const item = ({ query }) => {
  const { id } = query
  return (
    <div>
      <SingleItem id={id} />
    </div>
  )
}

item.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default item
