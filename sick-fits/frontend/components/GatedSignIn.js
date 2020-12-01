import React from 'react'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from './graphql/queries'
import SignIn from './SignIn'

const GatedSignIn = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data }, loading) => {
      if (loading) return <p>Loading...</p>

      if (!data?.me) {
        return (
          <div>
            <p>Please sign in!</p>
            <SignIn />
          </div>
        )
      }

      return children
    }}
  </Query>
)

GatedSignIn.propTypes = {
  children: PropTypes.element.isRequired,
}

export default GatedSignIn
