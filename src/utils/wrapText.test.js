import { wrapText } from './wrapText'

describe('wrapText', () => {
  it('wraps the selected range', () => {
    expect(wrapText('hola mundo', 5, 10, '**', '**')).toEqual({
      value: 'hola **mundo**',
      selectionStart: 7,
      selectionEnd: 12,
    })
  })

  it('inserts a fallback when nothing is selected', () => {
    expect(wrapText('abc', 3, 3, '*', '*', 'texto')).toEqual({
      value: 'abc*texto*',
      selectionStart: 4,
      selectionEnd: 9,
    })
  })
})
