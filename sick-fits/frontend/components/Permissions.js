import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { ALL_USERS_QUERY } from './graphql/queries'

import Error from './ErrorMessage'
import SickButton from './styles/SickButton'
import Table from './styles/Table'
import { UPDATE_PERMISSIONS_MUTATION } from './graphql/mutations'

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

const User = ({ user }) => {
  const { name, email, id, permissions } = user
  const [userPermissions, setUserPermissions] = useState(permissions)

  const handlePermissionChange = (e) => {
    const checkbox = e.target
    const newPermissions = [...userPermissions]

    if (checkbox.checked) {
      newPermissions.push(checkbox.value)
      setUserPermissions(newPermissions)
    } else {
      const removePermissions = newPermissions.filter(
        (permission) => permission !== checkbox.value
      )
      setUserPermissions(removePermissions)
    }
  }

  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{ permissions: userPermissions, userId: id }}
    >
      {(updatePermissions, { loading, error }) => (
        <>
          {error && <Error error={error} />}
          <tr>
            <td>{name}</td>
            <td>{email}</td>
            {possiblePermissions.map((permission) => (
              <td key={permission}>
                <label htmlFor={`${id}-permission-${permission}`}>
                  <input
                    id={`${id}-permission-${permission}`}
                    type="checkbox"
                    checked={userPermissions.includes(permission)}
                    value={permission}
                    onChange={handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? 'ing' : 'e'}
              </SickButton>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  )
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

export default Permissions
