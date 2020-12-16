import React, { useState } from 'react'
import Downshift from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import debounce from 'lodash.debounce'

import { SEARCH_ITEMS_QUERY } from './graphql/queries'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const AutoComplete = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const onChange = debounce(async (e, client) => {
    console.log('Searching...')
    setLoading(true)
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    })

    setItems(res.data.items)
    setLoading(false)
  }, 350)

  return (
    <SearchStyles>
      <div>
        <ApolloConsumer>
          {(client) => (
            <input
              type="search"
              onChange={(e) => {
                e.persist()
                onChange(e, client)
              }}
            />
          )}
        </ApolloConsumer>
        <DropDown>
          {items.map((item) => (
            <DropDownItem key={item.id}>
              <img width="50" src={item.image} alt={item.title} />
              {item.title}
            </DropDownItem>
          ))}
        </DropDown>
      </div>
    </SearchStyles>
  )
}

export default AutoComplete
