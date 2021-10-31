/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaymentType } from '../enums/PaymentType'
import { Locale } from '../enums/Locale'
import locales from '~/locales/locales.json'

export class PaymentService {
  public static getPaymentDescriptions(locale: Locale = Locale.EN_US) {
    return Object.keys(PaymentType).map((item) => ({
      value: item,
      // @ts-ignore
      text: locales[locale][item],
    }))
  }
}
