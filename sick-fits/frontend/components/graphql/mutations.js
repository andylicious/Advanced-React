import gql from 'graphql-tag'

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

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

export const SIGNIN_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`

export const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]!
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, id: $userId) {
      id
      email
      name
      permissions
    }
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`
