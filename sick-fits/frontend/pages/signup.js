import styled from 'styled-components'
import Signup from '../components/Signup'
import SignIn from '../components/SignIn'

const Column = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

function signup() {
  return (
    <Column>
      <Signup />
      <SignIn />
    </Column>
  )
}
export default signup
