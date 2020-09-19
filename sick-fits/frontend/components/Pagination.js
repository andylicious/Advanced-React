import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'

import PaginationStyles from './styles/PaginationStyles'
import { PAGINATION_QUERY } from './graphql/queries'
import { perPage } from '../config'

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error...</p>

      const { count } = data.itemsConnection.aggregate
      const pages = Math.ceil(count / perPage)

      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits! Page {page}</title>
          </Head>
          <Link href={{ pathname: 'items', query: { page: page - 1 } }}>
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} items total</p>
          <Link href={{ pathname: 'items', query: { page: page + 1 } }}>
            <a className="prev" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

Pagination.propTypes = {
  page: PropTypes.number,
}

export default Pagination
