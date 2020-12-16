import React, { useState } from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import debounce from 'lodash.debounce'

import { SEARCH_ITEMS_QUERY } from './graphql/queries'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const AutoComplete = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const onChange = debounce(async (e, client) => {
    if (e.target.value === '') return setItems([])
    setLoading(true)
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    })

    setItems(res.data.items)
    setLoading(false)
  }, 350)

  const routeToItem = (item) => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      },
    })
  }

  resetIdCounter()
  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={(item) => (item === null ? '' : item.title)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <ApolloConsumer>
              {(client) => (
                <input
                  {...getInputProps({
                    type: 'search',
                    placeholder: 'Search for an item',
                    className: loading ? 'loading' : '',
                    id: 'search',
                    onChange: (e) => {
                      e.persist()
                      onChange(e, client)
                    },
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    key={item.id}
                    {...getItemProps({ item })}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
              </DropDown>
            )}
            {!items.length && !loading && inputValue && (
              <DropDownItem>Nothing found for {inputValue}</DropDownItem>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  )
}

export default AutoComplete
