import { CreatePrintLayoutInput } from '../inputs/print_layout/CreatePrintLayoutInput'
import { PrintLayout } from '../models/print_layout/PrintLayout'
import { HeaderItem } from '../models/print_layout/single_line/HeaderItem'
import { PrintLayoutItem } from '../models/print_layout/PrintLayoutItem'
import { AddHeaderInput } from '../inputs/print_layout/AddHeaderInput'
import { EmptyLineItem } from '../models/print_layout/single_line/EmptyLineItem'
import { ProductTable } from '../models/print_layout/single_line/ProductTable'
import { PurchaseType } from '../enums/PurchaseType'
import { LineItem } from '../models/print_layout/single_line/LineItem'
import { CutItem } from '../models/print_layout/single_line/CutItem'
import { PaymentInfoItem } from '../models/print_layout/single_line/PaymentInfoItem'
import { PurchaseInformation } from '../models/print_layout/single_line/PurchaseInformation'

export class PrintLayoutService {
  public static getAll() {
    return PrintLayout.find()
  }

  public static getOne(id: PrintLayout['id']) {
    return PrintLayout.findOne(id)
  }

  public static create(layout: CreatePrintLayoutInput) {
    return PrintLayout.create({ name: layout.name }).save()
  }

  public static async remove(id: PrintLayout['id']) {
    const layout = await PrintLayout.findOne(id)
    if (!layout) throw new Error('Layout not found')
    await layout.softRemove()
    return true
  }

  public static async removeItem(
    id: PrintLayout['id'],
    itemId: PrintLayoutItem['id']
  ) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const item = await PrintLayoutItem.findOne(itemId)
    if (!item) throw new Error('Item not found')
    await item.remove()
    const items = layout.items
      .filter((i) => i.id !== itemId)
      .sort((a, b) => a.position - b.position)
    for (let i = 0; i < items.length; i++) {
      items[i].position = i
      await items[i].save()
    }
    return true
  }

  public static async clearItems(id: PrintLayout['id']) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')

    const items = await PrintLayoutItem.findByIds(
      layout.items.map((item) => item.id)
    )
    await Promise.all(items.map((item) => item.remove()))
    return true
  }

  public static async addHeader(
    id: PrintLayout['id'],
    headerInfo: AddHeaderInput
  ) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const header = await HeaderItem.create().save()
    header.mainLayout = layout

    header.storeName = headerInfo.storeName
    header.address = headerInfo.address
    header.cnpj = headerInfo.cnpj

    header.position = layout.items.length

    layout.items.push(header)

    await layout.save()

    return header.save()
  }

  public static async addEmptyLine(id: PrintLayout['id'], lines: number) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const emptyLine = await EmptyLineItem.create().save()
    emptyLine.mainLayout = layout
    emptyLine.numberOfLines = lines
    emptyLine.position = layout.items.length

    layout.items.push(emptyLine)

    await layout.save()

    return emptyLine.save()
  }

  public static async addProductTable(
    id: PrintLayout['id'],
    type: PurchaseType
  ) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const table = await ProductTable.create().save()

    table.mainLayout = layout
    table.type = 'ProductTable'
    table.printType = type
    table.position = layout.items.length
    layout.items.push(table)

    await layout.save()

    return table.save()
  }

  public static async addLineItem(id: PrintLayout['id'], character: string) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const lineItem = await LineItem.create().save()
    lineItem.character = character
    lineItem.mainLayout = layout
    lineItem.position = layout.items.length
    await lineItem.save()
    layout.items.push(lineItem)
    layout.save()
    return lineItem
  }

  public static async addCutItem(id: PrintLayout['id']) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const cut = await CutItem.create().save()
    cut.mainLayout = layout
    cut.position = layout.items.length
    await cut.save()
    layout.items.push(cut)
    return cut.save()
  }

  public static async addPaymentInfo(id: PrintLayout['id']) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const paymentInfo = await PaymentInfoItem.create().save()

    paymentInfo.mainLayout = layout
    paymentInfo.position = layout.items.length

    await paymentInfo.save()

    layout.items.push(paymentInfo)

    await layout.save()

    return paymentInfo.save()
  }

  public static async addPurchaseInformation(id: PrintLayout['id']) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')

    const purchaseInformation = await PurchaseInformation.create().save()
    purchaseInformation.mainLayout = layout
    purchaseInformation.position = layout.items.length

    await purchaseInformation.save()

    layout.items.push(purchaseInformation)

    await layout.save()

    return purchaseInformation.save()
  }

  public static async updatePosition(
    id: PrintLayout['id'],
    oldPosition: number,
    newPosition: number
  ) {
    const layout = await PrintLayout.findOne(id, { relations: ['items'] })
    if (!layout) throw new Error('Layout not found')
    const items = layout.items.sort((a, b) => a.position - b.position)
    if (oldPosition < newPosition) {
      const end = newPosition - 1
      const item = items[oldPosition]
      let i = 0
      let local = oldPosition

      do {
        items[local] = items[++local]
        i++
      } while (i < end - oldPosition)
      items[end] = item
    }

    if (oldPosition > newPosition) {
      const item = items[oldPosition]
      for (let i = oldPosition; i > newPosition; i--) {
        items[i] = items[i - 1]
      }
      items[newPosition] = item
    }

    for (let i = 0; i < items.length; i++) {
      items[i].position = i
    }

    await Promise.all(items.map((item) => item.save()))

    return true
  }
}
