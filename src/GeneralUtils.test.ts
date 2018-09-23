import { formatNumber } from './components/GeneralUtils';

test('formatNumber', () => {
    const num = 1000000
    const del = '.'
    const formatted = formatNumber(num, del)
    expect(formatted).toEqual('1.000.000')
})