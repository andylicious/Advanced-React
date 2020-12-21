import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import ItemComponent from '../components/Item'

const mockItem = {
  id: '12345abcdef',
  title: 'A pair of shoes',
  price: 50000,
  description: 'wear them on feet',
  image: 'dog.jpg',
  largeImage: 'largeDog.jpg',
}

describe('<Item />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(<ItemComponent item={mockItem} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  // let wrapper
  // beforeEach(() => {
  //   wrapper = shallow(<ItemComponent item={mockItem} />)
  // })

  // it('renders the image properly', () => {
  //   const img = wrapper.find('img')
  //   expect(img.props().src).toBe(mockItem.image)
  //   expect(img.props().alt).toBe(mockItem.title)
  // })

  // it('renders and displays properly', () => {
  //   const pTag = wrapper.find(PriceTag)
  //   expect(pTag.children().text()).toBe('$500')
  //   expect(wrapper.find('ForwardRef(Title) Link a').text()).toBe(mockItem.title)
  // })

  // it('renders out the buttons properly', () => {
  //   const buttonList = wrapper.find('.buttonList')
  //   expect(buttonList.children()).toHaveLength(3)
  //   expect(buttonList.find('Link').exists()).toBe(true)
  //   expect(buttonList.find('AddToCart')).toHaveLength(1)
  //   expect(buttonList.find('DeleteItem')).toHaveLength(1)
  // })
})
