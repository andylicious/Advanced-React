import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { REQUEST_RESET_MUTATION } from './graphql/mutations'

const initialState = {
  email: '',
}

const RequestReset = () => {
  const [state, setState] = useState(initialState)

  const onInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={state}>
      {(requestReset, { error, loading, called }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault()
            await requestReset()
            setState(initialState)
          }}
        >
          <fieldset>
            <h2>Request a password reset</h2>
            <Error error={error} />
            {!error && !loading && called && (
              <p>Success! Check your email for a reset link.</p>
            )}
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
            <button type="submit">Request reset</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default RequestReset
