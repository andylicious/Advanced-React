import React from 'react'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY } from './graphql/queries'
import { SIGNOUT_MUTATION } from './graphql/mutations'

const Signout = () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout) => <button onClick={signout}>Sign out</button>}
  </Mutation>
)

export default Signout
