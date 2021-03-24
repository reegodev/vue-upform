import { getNestedObject } from '../src/utils'

describe('utils', () => {
  describe('getNestedObject', () => {
    it('returns the initial object with an empty path', () => {
      const obj = {
        a: {
          b: {
            c: 'x',
          },
        },
      }

      expect(getNestedObject(obj, null)).toEqual(obj)
    })

    it('returns the initial object with an invalid path', () => {
      const obj = {
        a: {
          b: {
            c: 'x',
          },
        },
      }

      expect(getNestedObject(obj, [] as any)).toEqual(obj)
    })

    it('returns the deepest valid path', () => {
      const obj = {
        a: {
          b: {
            c: {},
            d: 'x',
          },
        },
      }

      expect(getNestedObject(obj, 'x')).toEqual(obj)
      expect(getNestedObject(obj, 'a')).toEqual(obj.a)
      expect(getNestedObject(obj, 'a.c')).toEqual(obj.a)
      expect(getNestedObject(obj, 'a.b')).toEqual(obj.a.b)
      expect(getNestedObject(obj, 'a.b.x')).toEqual(obj.a.b)
      expect(getNestedObject(obj, 'a.b.c')).toEqual(obj.a.b.c)
      expect(getNestedObject(obj, 'a.b.d')).toEqual(obj.a.b)
    })
  })
})
