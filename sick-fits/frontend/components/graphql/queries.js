import gql from 'graphql-tag'

export const GET_ALL_ITEMS_QUERY = gql`
  query GET_ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

export const GET_ITEM = gql`
  query GET_ITEM($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

export const GET_SINGLE_ITEM_QUERY = gql`
  query GET_SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      description
      id
      image
      largeImage
      price
      title
    }
  }
`

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`