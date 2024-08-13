import { createApp } from 'vue'
import vueTabevents from '../dist/vue-tabevents.min.js'

const app = createApp(App);
app.use(vueTabevents);


app.config.productionTip = false

app.mount('#app');
