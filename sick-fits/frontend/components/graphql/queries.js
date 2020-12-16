import gql from 'graphql-tag'
import { perPage } from '../../config'

export const GET_ALL_ITEMS_QUERY = gql`
  query GET_ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
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

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          title
          price
          image
          description
        }
      }
    }
  }
`

export const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      title
      image
    }
  }
`
