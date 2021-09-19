/**
 * @jest-environment jsdom
 */

 import { createForm, configs, } from '../../src/config'
 import { createFormRenderer } from '../../src/renderer'
import { mount } from '@vue/test-utils'
import Upform from '../../src/components/UpForm'
import { defineComponent, reactive } from 'vue'
import * as pretty from 'pretty'

const basicInputComponent = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    }
  },
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  template: `
    <input type="text" :name="name" v-model="model" />
  `
})

const alternateInputComponent = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    }
  },
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  template: `
    <div class="alternate-wrapper"><input type="text" :name="name" v-model="model" /></div>
  `
})



const basicGroupComponent = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div class="form-group"><slot /></div>
  `
})

describe('UpForm component', () => {
  afterEach(() => {
    configs.clear()
  })

  it('renders the form tree', () => {
    createForm({
      name: 'test1',
      fields: [
        {
          name: 'input1',
          as: basicInputComponent,
          props: {
            name: 'input1',
          },
        }
      ]
    })

    let wrapper = mount(Upform, {
      props: {
        name: 'test1',
      }
    })
    expect(wrapper.html()).toEqual(pretty(`
      <div class="upform-wrapper">
        <form class="upform-form"><input type="text" name="input1"></form>
      </div>
    `))

    createForm({
      name: 'test2',
      fields: [
        {
          name: 'input1',
          as: basicInputComponent,
          props: {
            name: 'input1',
          },
        },
        {
          name: 'input2',
          as: basicInputComponent,
          props: {
            name: 'input2',
          },
        },
        {
          as: basicGroupComponent,
          children: [
            {
              name: 'subInput1',
              as: basicInputComponent,
              props: {
                name: 'subInput1',
              },
            },
            {
              name: 'subInput2',
              as: basicInputComponent,
              props: {
                name: 'subInput2',
              },
            },
          ]
        }
      ]
    })

    wrapper = mount(Upform, {
      props: {
        name: 'test2',
      }
    })
    expect(wrapper.html()).toEqual(pretty(`
      <div class="upform-wrapper">
        <form class="upform-form"><input type="text" name="input1"><input type="text" name="input2">
          <div class="form-group"><input type="text" name="subInput1"><input type="text" name="subInput2"></div>
        </form>
      </div>
    `))
  })

  it('supports v-model', async () => {
    createForm({
      name: 'test1',
      fields: [
        {
          name: 'input1',
          as: basicInputComponent,
          props: {
            name: 'input1',
          },
        },
        {
          name: 'input2',
          as: basicInputComponent,
          props: {
            name: 'input2',
          },
        },
        {
          as: basicGroupComponent,
          children: [
            {
              name: 'subInput1',
              as: basicInputComponent,
              props: {
                name: 'subInput1',
              },
            },
            {
              name: 'subInput2',
              as: basicInputComponent,
              props: {
                name: 'subInput2',
              },
            },
          ]
        }
      ]
    })

    const wrapper = mount(Upform, {
      props: {
        name: 'test1',
        modelValue: {
          input1: 'test1',
          input2: 'test2',
          subInput1: 'test3',
          subInput2: 'test4',
        },
      }
    })

    const input1 = wrapper.get('input[name="input1"]')
    await input1.setValue('test1-updated')

    const updateEvent = wrapper.emitted('update:modelValue')
    expect(updateEvent).toHaveLength(1)
    expect(updateEvent[0][0].input1).toEqual('test1-updated')
  })

  it('allows specifying a custom renderer', () => {
    createFormRenderer({
      text: basicInputComponent,
    })

    createFormRenderer('alternate',{
      text: alternateInputComponent,
    })

    createForm({
      name: 'test1',
      fields: [
        {
          name: 'input1',
          as: 'text',
          props: {
            name: 'input1',
          },
        }
      ]
    })

    let wrapper = mount(Upform, {
      props: {
        name: 'test1',
      },
    })

    expect(wrapper.html()).toEqual(pretty(`
      <div class="upform-wrapper">
        <form class="upform-form"><input type="text" name="input1"></form>
      </div>
    `))

    wrapper = mount(Upform, {
      props: {
        name: 'test1',
        renderer: 'alternate'
      },
    })

    expect(wrapper.html()).toEqual(pretty(`
      <div class="upform-wrapper">
        <form class="upform-form"><div class="alternate-wrapper"><input type="text" name="input1"></div></form>
      </div>
    `))
  })

  it('emits a reset event', async () => {
    createForm({
      name: 'test1',
      fields: [
        {
          name: 'input1',
          as: basicInputComponent,
          props: {
            name: 'input1',
          },
        }
      ]
    })

    let wrapper = mount(Upform, {
      props: {
        name: 'test1',
        modelValue: {
          input1: 'test1',
          input2: 'test2',
          subInput1: 'test3',
          subInput2: 'test4',
        },
      },
    })

    const input1 = wrapper.get('input[name="input1"]')
    await input1.setValue('test1-updated')

    const updateEvent = wrapper.emitted('update:modelValue')
    expect(updateEvent).toHaveLength(1)
    expect(updateEvent[0][0].input1).toEqual('test1-updated')

    const form = wrapper.get('form')
    await form.trigger('reset')

    const resetEvent = wrapper.emitted('reset')
    expect(resetEvent).toHaveLength(1)
    expect(resetEvent[0][0]).toEqual({
      input1: 'test1',
      input2: 'test2',
      subInput1: 'test3',
      subInput2: 'test4'
    })
  })

  it('emits a submit event', async () => {
    createForm({
      name: 'test1',
      fields: [
        {
          name: 'input1',
          as: basicInputComponent,
          props: {
            name: 'input1',
          },
        }
      ]
    })

    let wrapper = mount(Upform, {
      props: {
        name: 'test1',
        modelValue: {
          input1: 'test1',
          input2: 'test2',
          subInput1: 'test3',
          subInput2: 'test4',
        },
      },
    })

    const input1 = wrapper.get('input[name="input1"]')
    await input1.setValue('test1-updated')

    const updateEvent = wrapper.emitted('update:modelValue')
    expect(updateEvent).toHaveLength(1)
    expect(updateEvent[0][0].input1).toEqual('test1-updated')

    const form = wrapper.get('form')
    await form.trigger('submit')

    const submitEvent = wrapper.emitted('submit')
    expect(submitEvent).toHaveLength(1)
    expect(submitEvent[0][0]).toEqual({
      input1: 'test1-updated',
      input2: 'test2',
      subInput1: 'test3',
      subInput2: 'test4'
    })
  })
})
