import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { SIGNIN_MUTATION } from './graphql/mutations'
import { CURRENT_USER_QUERY } from './graphql/queries'

const initialState = {
  email: '',
  password: '',
}

const SignIn = () => {
  const [state, setState] = useState(initialState)
  console.log(state)

  const onInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault()
            await signup()
            setState(initialState)
          }}
        >
          <fieldset>
            <h2>Sign in</h2>
            <Error error={error} />
            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={state.email}
                onChange={onInputChange}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={state.password}
                onChange={onInputChange}
              />
            </label>

            <button type="submit">Sign in!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default SignIn
