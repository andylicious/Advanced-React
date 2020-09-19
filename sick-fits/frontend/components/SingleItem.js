import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import { GET_SINGLE_ITEM_QUERY } from './graphql/queries'
import Error from './ErrorMessage'

const SingleItemStyle = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${(props) => props.theme.bs};
  display: grid;
  grid-column: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    widht: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

const SingleItem = ({ id }) => (
  <Query query={GET_SINGLE_ITEM_QUERY} variables={{ id }}>
    {({ data, error, loading }) => {
      if (error) return <Error error={error} />
      if (loading) return <p>Loading...</p>
      if (!data.item) return <p>No data found for item {id}...</p>

      const { description, largeImage, title } = data.item
      return (
        <SingleItemStyle>
          <Head>
            <title>Sick Fits | {title}</title>
          </Head>
          <img src={largeImage} alt={title} />
          <div className="details">
            <h2>Viewing {title}</h2>
            <p>{description}</p>
          </div>
        </SingleItemStyle>
      )
    }}
  </Query>
)

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default SingleItem
