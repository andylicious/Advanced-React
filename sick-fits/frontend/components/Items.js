import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import Item from './Item'
import { GET_ALL_ITEMS_QUERY } from './graphql/queries'

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${(props) => props.theme.maxWidth};

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`

const Items = () => {
  console.log('rerenderin')
  return (
    <div>
      <p>Items!</p>
      <Center>
        <Query query={GET_ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>

            if (error) return <p>Error: {error.message}!</p>

            return (
              <ItemsList>
                {data.items.map((item) => (
                  <Item item={item} key={item.id} />
                ))}
              </ItemsList>
            )
          }}
        </Query>
      </Center>
    </div>
  )
}

export default Items
