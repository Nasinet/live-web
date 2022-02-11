import Vue from 'vue'
import confirm from './buy-dynamic-alert'

const ConfirmCon = Vue.extend(confirm)

const init = (options) => {
  const instance = new ConfirmCon({
    propsData: {
      ...options.props
    },
    methods: {
      ...options.methods
    }
  })

  instance.vm = instance.$mount()

  document.body.appendChild(instance.vm.$el)

  return instance.vm
}

export default {
  install(Vue) {
    Vue.prototype.$buyConfirm = init
  }
}
