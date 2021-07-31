import { Context } from '@nuxt/types'
import { format, parse } from 'date-fns'
import Vue from 'vue'
import Dinero, { Currency } from 'dinero.js'

export const dineroFormatter = (
  value: string | number,
  currency: Currency = 'USD',
  locale: string
) =>
  Dinero({
    amount: parseInt((parseFloat(value.toString()) * 100).toString(), 10),
    currency,
  })
    .setLocale(locale || '')
    .toFormat('$0,0.00')

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

export default (context: Context) => {
  Vue.filter('dinero', (value: string | number) => {
    const { currency, locale } = context.store.state['site-settings']
    return dineroFormatter(value, currency !== '' ? currency : 'USD', locale)
  })
}
