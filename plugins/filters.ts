import { format, parse } from 'date-fns'
import Vue from 'vue'

Vue.filter('dateAndHour', (value: Date | string) => {
  if (typeof value === 'string') {
    const date = value.substr(0, 10)
    const time = value.substr(11, 8)
    return format(
      parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date()),
      'dd/MM/yyyy HH:mm:ss'
    )
  }
  return format(value, 'dd/MM/yyyy HH:mm:ss')
})
