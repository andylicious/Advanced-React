import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

const initialState = {
  title: '',
  description: '',
  image: '',
  largeImage: '',
  price: 0,
}

const CreateItem = () => {
  const [state, setState] = useState(initialState)

  const handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value

    setState({ ...state, [name]: val })
  }

  const onSubmit = async (e, createItem) => {
    e.preventDefault()

    const res = await createItem(state)
    console.log('res', { res })

    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id },
    })
  }

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error }) => (
        <Form onSubmit={(e) => onSubmit(e, createItem)}>
          <Error error={error} />

          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                onChange={handleChange}
                placeholder="Title"
                required
                value={state.title}
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
                value={state.price}
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
                value={state.description}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default CreateItem
