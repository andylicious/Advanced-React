import PleaseSignIn from '../components/SignIn'
import OrderList from '../components/OrderList'

const OrderPage = (props) => (
  <div>
    <PleaseSignIn>
      <OrderList />
    </PleaseSignIn>
  </div>
)

export default OrderPage
