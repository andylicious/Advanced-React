export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.item) return tally
    return tally + cartItem.quantity
  }, 0)
}
