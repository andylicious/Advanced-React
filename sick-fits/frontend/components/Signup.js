import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { SIGNUP_MUTATION } from './graphql/mutations'
import { CURRENT_USER_QUERY } from './graphql/queries'

const initialState = {
  name: '',
  email: '',
  password: '',
}

const Signup = () => {
  const [state, setState] = useState(initialState)

  const onInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
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
            <h2>Sign up for an account</h2>
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
            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={state.name}
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

            <button type="submit">Sign up!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default Signup
