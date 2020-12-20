import formatMoney from '../lib/formatMoney'

describe('lib/formatMoney', () => {
  it('should work with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01')
    expect(formatMoney(40)).toEqual('$0.40')
    expect(formatMoney(999)).toEqual('$9.99')
    expect(formatMoney(9998)).toEqual('$99.98')
  })

  it('should remove cents if even', () => {
    expect(formatMoney(100)).toEqual('$1')
    expect(formatMoney(5000)).toEqual('$50')
    expect(formatMoney(50000)).toEqual('$500')
  })

  it('should work with both whole and fractional dollars', () => {
    expect(formatMoney(5012)).toEqual('$50.12')
    expect(formatMoney(1020)).toEqual('$10.20')
    expect(formatMoney(120)).toEqual('$1.20')
    expect(formatMoney(12491042)).toEqual('$124,910.42')
  })
})
