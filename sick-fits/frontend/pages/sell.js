import CreateItem from '../components/CreateItem'
import GatedSignIn from '../components/GatedSignIn'

export default function Sell() {
  return (
    <GatedSignIn>
      <CreateItem />
    </GatedSignIn>
  )
}
