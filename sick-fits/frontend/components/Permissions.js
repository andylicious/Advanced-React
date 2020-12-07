import { Query } from 'react-apollo'
import React from 'react'
import PropTypes from 'prop-types'
import { ALL_USERS_QUERY } from './graphql/queries'

import Error from './ErrorMessage'
import SickButton from './styles/SickButton'
import Table from './styles/Table'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />

        <h2>Manage permissions:</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map((p) => (
                <th key={p}>{p}</th>
              ))}
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
)

const User = ({ user }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    {possiblePermissions.map((permission) => (
      <td key={permission}>
        <label htmlFor={`${user.id}-permission-${permission}`}>
          <input type="checkbox" />
        </label>
      </td>
    ))}
    <td>
      <SickButton>Update</SickButton>
    </td>
  </tr>
)

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
}

export default Permissions
