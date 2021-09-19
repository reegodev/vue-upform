import { createForm, configs } from '../src/config'

describe('createForm', () => {
  afterEach(() => {
    configs.clear()
  })

  it('throws an error if the form name has already been used', () => {
    createForm({
      name: 'test_createForm_1_1',
      fields: [],
    })

    expect(() => {
      createForm({
        name: 'test_createForm_1_1',
        fields: [],
      })
    }).toThrow(`A form named "test_createForm_1_1" is already present.`)
  })

  it('adds a form entry to the models map', () => {
    createForm({
      name: 'test_createForm_2_1',
      fields: [],
    })

    expect(configs.has('test_createForm_2_1')).toBe(true)
  })

  it('normalizes form entry to object config', () => {
    createForm({
      name: 'test_createForm_3_1',
      fields: [],
    })
    expect(configs.has('test_createForm_3_1')).toBe(true)
    const model1 = configs.get('test_createForm_3_1')
    expect(model1).toBeInstanceOf(Object)
    expect(model1).toHaveProperty('renderer', 'default')
    expect(model1).toHaveProperty('extends', '')
    expect(model1).toHaveProperty('fields', [])

    createForm({
      name: 'test_createForm_3_2',
      renderer: 'renderer_3_2',
      extends: 'form_3_2',
      fields: [],
    })
    expect(configs.has('test_createForm_3_2')).toBe(true)
    const model2 = configs.get('test_createForm_3_2')
    expect(model2).toBeInstanceOf(Object)
    expect(model2).toHaveProperty('renderer', 'renderer_3_2')
    expect(model2).toHaveProperty('extends', 'form_3_2')
    expect(model2).toHaveProperty('fields', [])
  })
})
