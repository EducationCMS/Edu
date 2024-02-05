import { createApp } from "vue"
import App from "./App.vue"
import PrimeVue from "primevue/config"
import router from "./router"
import { createPinia } from "pinia"

import Button from "primevue/button"
import InputText from "primevue/inputtext"
import InputMask from "primevue/inputmask"
import CascadeSelect from "primevue/cascadeselect"
import RadioButton from "primevue/radiobutton"
import Slider from "primevue/slider"
import Image from "primevue/image"
import Avatar from "primevue/avatar"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Dialog from "primevue/dialog"
import Password from "primevue/password"
import AutoComplete from "primevue/autocomplete"
import Calendar from "primevue/calendar"
import Dropdown from "primevue/dropdown"
import Tag from "primevue/tag"
import MultiSelect from "primevue/multiselect"
import Divider from "primevue/divider"
import Toast from "primevue/toast"
import ToastService from "primevue/toastservice"
import ConfirmationService from "primevue/confirmationservice"
import Timer from "@vue-layout/countdown"

import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.min.css"
import "@/assets/styles/main.scss"
import Panel from "primevue/panel"
import FileUpload from "primevue/fileupload"

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(Timer)
app.use(PrimeVue, {
  locale: {
    firstDayOfWeek: 1, // Monday
    dayNames: [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ],
    monthNamesShort: [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек'
    ],
    today: 'Сегодня',
    clear: 'Очистить'
  }
})

app.use(ToastService)
app.use(ConfirmationService)
app.use(pinia)


app.component("Button", Button)
app.component("Slider", Slider)
app.component("Image", Image)
app.component("Avatar", Avatar)
app.component("InputText", InputText)
app.component("InputMask", InputMask)
app.component("CascadeSelect", CascadeSelect)
app.component("RadioButton", RadioButton)
app.component("DataTable", DataTable)
app.component("Column", Column)
app.component("Dialog", Dialog)
app.component("Password", Password)
app.component("AutoComplete", AutoComplete)
app.component("Calendar", Calendar)
app.component("Dropdown", Dropdown)
app.component("Tag", Tag)
app.component("MultiSelect", MultiSelect)
app.component("Toast", Toast)
app.component("Divider", Divider)
app.component("Panel", Panel)
app.component("FileUpload", FileUpload)

app.mount("#app")
