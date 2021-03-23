import { getFormRenderer, createFormRenderer } from '../src/renderer'

describe('renderer', () => {
  describe('getFormRenderer', () => {
    it('throws an error if the renderer does not exist', () => {
      expect(() => {
        getFormRenderer('bad_name')
      }).toThrow('Cannot find renderer "bad_name".')
    })

    it('returns an existing renderer', () => {
      createFormRenderer('test_getRenderer2', {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        test: { render: () => {} },
      })
      const renderer = getFormRenderer('test_getRenderer2')

      expect(renderer).toHaveProperty('test')
    })
  })

  describe('createFormRenderer', () => {
    it('throws an error with an empty config', () => {
      expect(() => {
        createFormRenderer('asd' as any)
      }).toThrow('Invalid renderer config.')

      expect(() => {
        createFormRenderer({})
      }).toThrow('Invalid renderer config.')

      expect(() => {
        createFormRenderer('test', {})
      }).toThrow('Invalid renderer config.')
    })

    it('throws an error if a name has already been used', () => {
      createFormRenderer('test_createRenderer2', {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        test: { render: () => {} },
      })

      expect(() => {
        createFormRenderer('test_createRenderer2', {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          test: { render: () => {} },
        })
      }).toThrow(`Renderer "test_createRenderer2" has already been registered.`)
    })

    it('creates a renderer by its name', () => {
      createFormRenderer('test_createRenderer3', {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        test: { render: () => {} },
      })

      const renderer = getFormRenderer('test_createRenderer3')
      expect(renderer).toHaveProperty('test')
    })

    it('creates a renderer with a default name', () => {
      createFormRenderer({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        test: { render: () => {} },
      })

      const renderer = getFormRenderer('default')
      expect(renderer).toHaveProperty('test')
    })
  })
})
