import React, { useState } from 'react'
import { Mutation, Query } from 'react-apollo'
import Router from 'next/router'
import PropTypes from 'prop-types'

import Form from './styles/Form'
import Error from './ErrorMessage'
import { GET_ITEM } from './graphql/queries'
import { UPDATE_ITEM_MUTATION } from './graphql/mutations'

const UpdateItem = ({ id }) => {
  const [state, setState] = useState({})

  const handlePriceChange = (val) => (val ? parseFloat(val) : val)

  const handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? handlePriceChange(value) : value

    setState({ ...state, [name]: val })
  }

  const onSubmit = async (e, updateItem) => {
    e.preventDefault()

    const res = await updateItem({ variables: { id, ...state } })

    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    })
  }

  return (
    <Query query={GET_ITEM} variables={{ id }}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>
        if (!data.item) return <p>No Item for id: {id}!</p>

        return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={state}>
            {(updateItem, { isLoading, error }) => (
              <Form onSubmit={(e) => onSubmit(e, updateItem)}>
                <Error error={error} />

                <fieldset
                  disabled={isLoading || loading}
                  aria-busy={isLoading || loading}
                >
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="title"
                      name="title"
                      onChange={handleChange}
                      placeholder="Title"
                      required
                      defaultValue={data.item.title}
                    />
                  </label>

                  <label htmlFor="price">
                    Price
                    <input
                      type="number"
                      id="price"
                      name="price"
                      onChange={handleChange}
                      placeholder="Price"
                      required
                      defaultValue={data.item.price}
                    />
                  </label>

                  <label htmlFor="description">
                    Description
                    <input
                      id="description"
                      name="description"
                      onChange={handleChange}
                      placeholder="Enter a description"
                      required
                      defaultValue={data.item.description}
                    />
                  </label>
                  <button type="submit">Submit</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        )
      }}
    </Query>
  )
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default UpdateItem
