import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { RESET_MUTATION } from './graphql/mutations'
import { CURRENT_USER_QUERY } from './graphql/queries'

const initialState = {
  confirmPassword: '',
  password: '',
}

const Reset = ({ resetToken }) => {
  const [state, setState] = useState(initialState)

  const onInputChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value })

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{ ...state, resetToken }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(requestReset, { error }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault()
            await requestReset()
            setState(initialState)
          }}
        >
          <fieldset>
            <h2>Reset your password</h2>
            <Error error={error} />
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="New password"
                value={state.password}
                onChange={onInputChange}
              />
            </label>
            <label htmlFor="confirmPassword">
              Email
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={state.confirmPassword}
                onChange={onInputChange}
              />
            </label>
            <button type="submit">Reset your password</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
}

export default Reset
