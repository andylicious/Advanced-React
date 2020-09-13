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
