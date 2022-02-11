import Vue from 'vue'

import { Button, Slider, Pagination, Message, Input, Select, Option, Dialog, Carousel, CarouselItem, DatePicker, Icon, Loading, Tooltip, MessageBox } from 'element-ui'
import BuyConfirm from '../components/buy-dynamic-alert/'

import '../assets/element-variables.scss'

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox

Vue.use(Button)
Vue.use(Slider)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(BuyConfirm)
Vue.use(DatePicker)
Vue.use(Icon)
Vue.use(Loading)
Vue.use(Tooltip)

