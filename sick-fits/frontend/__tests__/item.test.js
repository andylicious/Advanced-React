import ItemComponent from '../components/Item'
import PriceTag from '../components/styles/PriceTag'
import { shallow } from 'enzyme'

const mockItem = {
  id: '12345abcdef',
  title: 'A pair of shoes',
  price: 50000,
  description: 'wear them on feet',
  image: 'dog.jpg',
  largeImage: 'largeDog.jpg',
}

describe('<Item />', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<ItemComponent item={mockItem} />)
    const pTag = wrapper.find(PriceTag)
    console.log(wrapper.debug())
    expect(pTag.children().text()).toBe('$500')
  })
})
