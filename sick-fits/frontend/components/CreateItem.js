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

  const handlePriceChange = (val) => (val ? parseFloat(val) : val)

  const handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? handlePriceChange(value) : value

    setState({ ...state, [name]: val })
  }

  const onSubmit = async (e, createItem) => {
    e.preventDefault()

    const res = await createItem(state)

    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id },
    })
  }

  const uploadFile = async (e) => {
    const { files } = e.target
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dcrzhlcbu/image/upload',
      {
        method: 'POST',
        body: data,
      }
    )

    const file = await res.json()

    setState({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    })
  }

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error }) => (
        <Form onSubmit={(e) => onSubmit(e, createItem)}>
          <Error error={error} />

          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                onChange={uploadFile}
                placeholder="Upload image"
                required
              />
              {state.image && <img src={state.image} alt="upload preview" />}
            </label>

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
