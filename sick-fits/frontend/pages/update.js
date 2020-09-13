import PropTypes from 'prop-types'
import UpdateItem from '../components/UpdateItem'

function Sell({ query }) {
  return (
    <div>
      <UpdateItem id={query.id} />
    </div>
  )
}

Sell.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }),
}

export default Sell
