import fs from 'fs'
import path from 'path'
import '~/locales/en-us.json'
import '~/locales/pt-br.json'

export class PaymentService {
  public static getPaymentDescriptions(locale?: string) {
    const extension = '.json'
    const dir = path.resolve(__dirname, '..', '..', 'locales')
    const fileName = `${locale ?? 'en-us'}${extension}`
    const files = fs.readdirSync(dir)

    if (!files.includes(fileName)) {
      return new Error('Locale not found')
    }
    const file = fs.readFileSync(path.resolve(dir, fileName))

    return Object.entries(JSON.parse(file.toString())).map(([key, value]) => ({
      text: key,
      value,
    }))
  }
}
