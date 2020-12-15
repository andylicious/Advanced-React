import React from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { DELETE_ITEM_MUTATION } from './graphql/mutations'
import { GET_ALL_ITEMS_QUERY } from './graphql/queries'

const DeleteItem = ({ children, id }) => {
  const onDeletePress = (e, deleteItemMutation) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation()
    }
  }

  const onDeleteSuccess = (cache, payload) => {
    // 1. Read cache≥
    const data = cache.readQuery({ query: GET_ALL_ITEMS_QUERY })
    // 2. Filter out the deleted item
    const filteredItems = data.items.filter(
      (item) => item.id !== payload.data.deleteItem.id
    )

    cache.writeQuery({
      query: GET_ALL_ITEMS_QUERY,
      data: { items: filteredItems },
    })
  }

  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id }}
      update={onDeleteSuccess}
    >
      {(deleteItem, { error, loading }) => (
        <button onClick={(e) => onDeletePress(e, deleteItem)}>
          {children}
        </button>
      )}
    </Mutation>
  )
}

DeleteItem.propTypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default DeleteItem
