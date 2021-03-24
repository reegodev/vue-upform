import {
  createForm,
  models,
  renderControl,
  renderForm,
  UpformContext,
} from '../src/form'
import { Component, defineComponent, h } from 'vue'

const createFormContext = (value = {}): UpformContext => {
  return {
    submit: () => {
      //
    },
    reset: () => {
      //
    },
    emit: (event: string) => {
      //
    },
    value,
    status: {},
  }
}

const createComponent = () => {
  return defineComponent({
    name: 'TestComponent',
    render() {
      return h('div')
    },
  })
}

describe('form', () => {
  describe('createForm', () => {
    it('throws an error if the form name has already been used', () => {
      createForm('test_createForm_1_1', [])

      expect(() => {
        createForm('test_createForm_1_1', [])
      }).toThrow(`A form named "test_createForm_1_1" is already present.`)
    })

    it('adds a form entry to the models map', () => {
      createForm('test_createForm_2_1', {
        fields: [],
      })

      expect(models.has('test_createForm_2_1')).toBe(true)
    })

    it('normalizes form entry to object config', () => {
      createForm('test_createForm_3_1', [])
      expect(models.has('test_createForm_3_1')).toBe(true)
      const model1 = models.get('test_createForm_3_1')
      expect(model1).toBeInstanceOf(Object)
      expect(model1).toHaveProperty('renderer', 'default')
      expect(model1).toHaveProperty('extends', '')
      expect(model1).toHaveProperty('fields', [])

      createForm('test_createForm_3_2', {
        renderer: 'renderer_3_2',
        extends: 'form_3_2',
        fields: [],
      })
      expect(models.has('test_createForm_3_2')).toBe(true)
      const model2 = models.get('test_createForm_3_2')
      expect(model2).toBeInstanceOf(Object)
      expect(model2).toHaveProperty('renderer', 'renderer_3_2')
      expect(model2).toHaveProperty('extends', 'form_3_2')
      expect(model2).toHaveProperty('fields', [])
    })
  })

  describe('renderControl', () => {
    it('throws an error with an invalid renderer', () => {
      expect(() => {
        renderControl(
          {
            as: 'text',
            name: 'test',
          },
          createFormContext(),
        )
      }).toThrow(`Cannot find renderer "null".`)
    })

    it('throws an error with an invalid component', () => {
      expect(() => {
        renderControl(
          {
            as: null,
            name: 'test',
          },
          createFormContext(),
        )
      }).toThrow(`Missing render component for field "test".`)
    })

    it('returns a vNode with the corresponding render component', () => {
      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
        },
        createFormContext(),
      )

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('type')
      expect((vnode.type as Component).name).toEqual('TestComponent')
    })

    it('returns a vNode with the control props', () => {
      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
          props: {
            message: 'Hello world',
          },
        },
        createFormContext(),
      )

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode.props).toHaveProperty('message', 'Hello world')
    })

    it('returns a vNode with the control children', () => {
      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
          children: [
            {
              as: createComponent(),
              name: 'subtest',
            },
            {
              as: createComponent(),
              name: 'subtes2',
            },
          ],
        },
        createFormContext(),
      )

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('children')
      expect(vnode.children).toHaveProperty('default')

      const defaultContent = (vnode.children as any).default()

      expect(Array.isArray(defaultContent)).toBe(true)
      expect(defaultContent.length).toBe(2)

      for (const child of defaultContent) {
        expect(child).toHaveProperty('__v_isVNode', true)
        expect(child).toHaveProperty('type')
        expect(child.type.name).toEqual('TestComponent')
      }
    })

    it('populates the form model with empty data', () => {
      const model = {}

      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
          children: [
            {
              as: createComponent(),
              name: 'subtest',
            },
            {
              as: createComponent(),
              name: 'subtes2',
            },
          ],
        },
        createFormContext(model),
      )

      ;(vnode.children as any).default()

      expect(model).toMatchObject({
        test: {
          subtest: null,
          subtes2: null,
        },
      })
    })

    it('populates the form model using initial values', () => {
      const model = {}

      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
          children: [
            {
              as: createComponent(),
              name: 'subtest',
              initialValue: [],
            },
            {
              as: createComponent(),
              name: 'subtes2',
              initialValue: 0,
            },
          ],
        },
        createFormContext(model),
      )

      ;(vnode.children as any).default()

      expect(model).toMatchObject({
        test: {
          subtest: [],
          subtes2: 0,
        },
      })
    })

    it('does not alter initial model data if valid', () => {
      const model = {
        test: {
          subtest: 'hello',
          subtes2: true,
        },
      }

      const vnode = renderControl(
        {
          as: createComponent(),
          name: 'test',
          children: [
            {
              as: createComponent(),
              name: 'subtest',
              initialValue: 'hello',
            },
            {
              as: createComponent(),
              name: 'subtes2',
              initialValue: true,
            },
          ],
        },
        createFormContext(model),
      )

      ;(vnode.children as any).default()

      expect(model).toMatchObject({
        test: {
          subtest: 'hello',
          subtes2: true,
        },
      })
    })
  })

  describe('renderForm', () => {
    it('throws an error if the form is not registered', () => {
      expect(() => {
        renderForm('bad_name_3_1', createFormContext())
      }).toThrow(`Form "bad_name_3_1" does not exist.`)
    })

    it('renders a specific html structure', () => {
      createForm('test_3_2', [
        {
          as: defineComponent({
            name: 'TestComponent',
            render() {
              return h('div')
            },
          }),
          name: 'test_3_2_1',
          initialValue: 'hello',
        },
      ])

      const vnode = renderForm('test_3_2', createFormContext())
      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('type', 'div')
      expect(vnode).toHaveProperty('props', { class: 'upform-wrapper' })
      expect(vnode).toHaveProperty('children')
      expect(Array.isArray(vnode.children)).toBe(true)
      expect(vnode.children.length).toBe(1)

      const form = vnode.children[0]
      expect(form).toHaveProperty('__v_isVNode', true)
      expect(form).toHaveProperty('type', 'form')
      expect(form.props).toHaveProperty('class', 'upform-form')
      expect(form.props).toHaveProperty('onReset')
      expect(form.props).toHaveProperty('onSubmit')
    })
  })
})
