import { Form } from '../src/FormInstance'
import { createForm, configs, } from '../src/config'
import { createFormRenderer, } from '../src/renderer'
import * as Vue from 'vue'

const _originalGetCurrentInstance = Vue.getCurrentInstance

const createWrapperComponent = (cb: () => void) => {
  // @ts-ignore
  Vue.getCurrentInstance = jest.fn(() => ({}))
  cb()
  // @ts-ignore
  Vue.getCurrentInstance = _originalGetCurrentInstance
}

const emitStack = []
const ctx: Vue.SetupContext<Vue.EmitsOptions> = {
  attrs: {},
  slots: {},
  emit: (event, value) => emitStack.unshift({
    event,
    value,
  }),
  expose: () => {},
}
const createEvent = () => ({
  defaultPrevented: false,
  propagates: true,
  preventDefault() { this.defaultPrevented = true },
  stopPropagation() { this.propagates = false },
})

const createComponent = () => {
  return Vue.defineComponent({
    name: 'TestComponent',
    render() {
      return Vue.h('div')
    },
  })
}

describe('FormInstance', () => {
  afterEach(() => {
    configs.clear()
  })

  it('throws an error if the config does not exist', () => {
    expect(() => new Form({
      name: 'asd',
    }, ctx)).toThrowError(`Form "asd" does not exist.`)
  })

  it('throws an error if it is not initialized inside a component setup method', () => {
    createForm({
      name: 'xxx',
      fields: [],
    })
    expect(() => new Form({
      name: 'xxx',
    }, ctx)).toThrowError(`Component instance not found for form "xxx".`)
  })

  it('sets the renderer name', () => {
    createForm({
      name: 'xxx',
      renderer: null,
      fields: [],
    })

    createForm({
      name: 'yyy',
      fields: [],
    })

    createForm({
      name: 'zzz',
      renderer: 'test',
      fields: [],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      expect(form.renderer).toEqual('default')

      const form2 = new Form({
        name: 'yyy',
      }, ctx)
      expect(form2.renderer).toEqual('default')

      const form3 = new Form({
      name: 'zzz',
    }, ctx)
      expect(form3.renderer).toEqual('test')

      const form4 = new Form({
        name: 'zzz',
        renderer: 'test2',
      }, ctx)
      expect(form4.renderer).toEqual('test2')
    })
  })

  it('creates the initial form value', () => {
    createForm({
      name: 'xxx',
      fields: [],
    })
  
    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      expect(form.value).toEqual({})
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
        initialValue: null,
      }, ctx)
      expect(form.value).toEqual({})
    })

    createForm({
      name: 'zzz',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'zzz',
      }, ctx)
      expect(form.value).toEqual({
        a: null,
      })
    })

    createForm({
      name: 'yyy',
      fields: [
        {
          name: 'a',
          as: 'group',
          children: [
            {
              name: 'b',
              as: 'group',
              children: [
                {
                  name: 'c',
                  as: 'text',
                },
                {
                  name: 'd',
                  as: 'text',
                },
              ]
            },
            {
              name: 'e',
              as: 'text',
            }
          ]
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'yyy',
      }, ctx)
      expect(form.value).toEqual({
        a: {
          b: {
            c: null,
            d: null,
          },
          e: null,
        },
      })
    })

    createForm({
      name: 'www',
      fields: [
        {
          name: 'a',
          as: 'group',
          children: [
            {
              name: 'b',
              as: 'group',
              children: [
                {
                  name: 'c',
                  as: 'text',
                  initialValue: 'cValue'
                },
                {
                  name: 'd',
                  as: 'text',
                },
              ]
            },
            {
              name: 'e',
              as: 'text',
              initialValue: false,
            }
          ]
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'www',
      }, ctx)
      expect(form.value).toEqual({
        a: {
          b: {
            c: 'cValue',
            d: null,
          },
          e: false,
        },
      })
    })

    createForm({
      name: 'test1',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ]
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'test1',
      }, ctx)
      form.createInitialValue()
      expect(form.value).toEqual({
        a: null
      })
    })
  })

  it('uses the provided initial form value', () => {
    createForm({
      name: 'www',
      fields: [
        {
          name: 'a',
          as: 'group',
          children: [
            {
              name: 'b',
              as: 'group',
              children: [
                {
                  name: 'c',
                  as: 'text',
                  initialValue: 'cValue'
                },
                {
                  name: 'd',
                  as: 'text',
                },
              ]
            },
            {
              name: 'e',
              as: 'text',
              initialValue: false,
            }
          ],
        },
        {
          as: 'group',
          children: [
            {
              name: 'aaChild',
              as: 'text',
            }
          ]
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'www',
        initialValue: {
          a: {
            b: {
              c: 'myValue',
              d: true
            },
            e: 45,
          },
          aaChild: 'asd',
        }
      }, ctx)

      expect(form.value).toEqual({
        a: {
          b: {
            c: 'myValue',
            d: true
          },
          e: 45,
        },
        aaChild: 'asd',
      })
    })
  })

  it('returns the form value as a reactive object', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })
  
    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      expect(Vue.isReactive(form.value)).toBe(true)
    })
  })

  it('throws an error with an invalid field renderer', () => {
    expect(() => {
      createForm({
        name: 'xxx',
        fields: [
          {
            name: 'a',
            as: 'text',
          }
        ],
      })

      createWrapperComponent(() => {
        const form = new Form({
          name: 'xxx',
        }, ctx)
        form.renderControl({
          name: 'a',
          as: 'text',
        })
      })

    }).toThrow(`Cannot find renderer "default".`)
  })

  it('uses a component defined in the renderer config', () => {
    createFormRenderer({
      text: createComponent(),
    })
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.renderControl({
        name: 'a',
        as: 'text',
      })

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('type')
      expect((vnode.type as Vue.Component).name).toEqual('TestComponent')
    })
  })

  it('throws an error with an invalid component', () => {
    expect(() => {
      createForm({
        name: 'xxx',
        fields: [
          {
            name: 'a',
            as: 'text',
          }
        ],
      })

      createWrapperComponent(() => {
        const form = new Form({
          name: 'xxx',
        }, ctx)
        form.renderControl({
          name: 'a',
          as: null,
        })
      })
    }).toThrow(`Missing render component for field "a" on form "xxx".`)
  })

  it('returns a vNode with the corresponding render component', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.renderControl({
        name: 'a',
        as: createComponent(),
      })

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('type')
      expect((vnode.type as Vue.Component).name).toEqual('TestComponent')

      expect(vnode).toHaveProperty('children')
      expect(vnode.children).toHaveProperty('default')

      const defaultContent = (vnode.children as any).default()
      expect(defaultContent).toEqual([])
    })
    
  })

  it('returns a vNode with the control props', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.renderControl({
        name: 'a',
        as: createComponent(),
        props: {
          message: 'Hello world',
        },
      })

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode.props).toHaveProperty('message', 'Hello world')
    })
  })

  it('returns a vNode with v-model support', () => {
    createForm({
      name: 'xxx',
      fields: [],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
        initialValue: {
          a: 1,
        }
      }, ctx)
      const leafVNode = form.renderControl({
        name: 'a',
        as: createComponent(),
        props: {
          message: 'Hello world',
        },
      })

      const groupVNode = form.renderControl({
        as: createComponent(),
        props: {
          message: 'Hello world',
        },
      })

      expect(leafVNode.props).toHaveProperty('modelValue', 1)
      expect(leafVNode.props).toHaveProperty('onUpdate:modelValue')

      leafVNode.props['onUpdate:modelValue'](5)
      expect(form.value.a).toBe(5)

      expect(groupVNode.props).not.toHaveProperty('modelValue')
      expect(groupVNode.props).not.toHaveProperty('onUpdate:modelValue')
    })
  })

  it('returns a vNode with the control children', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: 'text',
        }
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.renderControl({
        name: 'a',
        as: createComponent(),
        children: [
          {
            as: createComponent(),
            name: 'subtest',
          },
          {
            as: createComponent(),
            name: 'subtest2',
          },
        ],
      })

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
  })

  it('returns a vNode with the rendered form', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: createComponent(),
        },
        {
          name: 'b',
          as: createComponent(),
        },
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.render()

      expect(vnode).toHaveProperty('__v_isVNode', true)
      expect(vnode).toHaveProperty('type', 'div')
      expect(vnode.props).toHaveProperty('class', 'upform-wrapper')
      expect(vnode).toHaveProperty('children')
      expect(Array.isArray(vnode.children)).toBe(true)
      expect(vnode.children.length).toBe(1)

      const formElement = (vnode.children[0])
      expect(formElement).toHaveProperty('type', 'form')
      expect(formElement.props).toHaveProperty('class', 'upform-form')
      expect(formElement.props).toHaveProperty('onSubmit')
      expect(formElement.props).toHaveProperty('onReset')
      expect(formElement).toHaveProperty('children')

      for (const child of formElement.children) {
        expect(child).toHaveProperty('__v_isVNode', true)
        expect(child).toHaveProperty('type')
        expect(child.type.name).toEqual('TestComponent')
      }
    })
  })

  it('emits events', () => {
    createForm({
      name: 'xxx',
      fields: [
        {
          name: 'a',
          as: createComponent(),
        },
        {
          name: 'b',
          as: createComponent(),
        },
      ],
    })

    createWrapperComponent(() => {
      const form = new Form({
        name: 'xxx',
      }, ctx)
      const vnode = form.render()
      const formElement = (vnode.children[0])

      form.value.a = 'updatedA'
      form.value.b = 'updatedB'

      const submitEvent = createEvent()
      formElement.props.onSubmit(submitEvent)
      expect(submitEvent.defaultPrevented).toBe(true)
      expect(submitEvent.propagates).toBe(false)

      expect(emitStack[0]).toEqual({
        event: 'submit',
        value: {
          a: 'updatedA',
          b: 'updatedB',
        }
      })

      const resetEvent = createEvent()
      formElement.props.onReset(resetEvent)
      expect(resetEvent.defaultPrevented).toBe(true)
      expect(resetEvent.propagates).toBe(false)

      expect(emitStack[0]).toEqual({
        event: 'reset',
        value: {
          a: null,
          b: null,
        }
      })

      expect(form.value).toEqual({
        a: null,
        b: null,
      })
    })
  })

})
