import { CreatePrintLayoutInput } from '../inputs/print_layout/CreatePrintLayoutInput'
import { PrintLayout } from '../models/print/PrintLayout'
import { HeaderItem } from '../models/print/single_line/HeaderItem'
import { PrintLayoutItem } from '../models/print/PrintLayoutItem'
import { AddHeaderInput } from '../inputs/print_layout/AddHeaderInput'
import { EmptyLineItem } from '../models/print/single_line/EmptyLineItem'
import { ProductTable } from '../models/print/single_line/ProductTable'
import { PurchaseType } from '../enums/PurchaseType'
import { LineItem } from '../models/print/single_line/LineItem'
import { CutItem } from '../models/print/single_line/CutItem'

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
    const layout = await PrintLayout.findOne(id)
    if (!layout) throw new Error('Layout not found')
    const item = await PrintLayoutItem.findOne(itemId)
    if (!item) throw new Error('Item not found')
    await item.remove()
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
    await cut.save()
    layout.items.push(cut)
    return cut.save()
  }
}
