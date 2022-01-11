import { CreateEstablishmentTableInput } from '../inputs/CreateEstablishmentTableInput'
import { EstablishmentTable } from '../models/EstablishmentTable'
import { Purchase } from '../models/Purchase'
import { PurchaseOrigin } from '../enums/PurchaseOrigin'
import { PurchaseType } from '../enums/PurchaseType'
import { User } from '../models/User'
import { Product } from '../models/Product'
import { HistoryProduct } from '../models/HistoryProduct'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'

export class EstablishmentTableService {
  public static getTables() {
    return EstablishmentTable.find()
  }

  public static getOne(id: EstablishmentTable['id']) {
    return EstablishmentTable.findOne(id)
  }

  public static create(table: CreateEstablishmentTableInput) {
    const newTable = EstablishmentTable.create()
    Object.assign(newTable, table)
    return newTable.save()
  }

  public static async addItem(
    id: EstablishmentTable['id'],
    productInput: ProductForPurchaseInput
  ) {
    const table = await EstablishmentTable.findOne(id, {
      relations: ['activeOrder', 'activeOrder.products'],
    })

    if (!table) throw new Error('Table not found')
    if (!table.activeOrder || !table.inUse) throw new Error('Table not in use')
    const product = await Product.findOne(productInput.id)
    if (!product) throw new Error('Product not found')
    let historyProduct: HistoryProduct

    const existingIndex = table.activeOrder.products.findIndex(
      (history) => Number(history.productId) === Number(product.id)
    )

    if (existingIndex !== -1) {
      historyProduct = table.activeOrder.products[existingIndex]
      historyProduct.data.amount =
        Number(productInput.amount) + Number(historyProduct.data.amount)
    } else {
      historyProduct = HistoryProduct.create()
      historyProduct.data = product
      historyProduct.data.amount = productInput.amount

      historyProduct.productId = productInput.id
      historyProduct.purchase = table.activeOrder

      table.activeOrder.products.push(historyProduct)
    }
    await historyProduct.save()
    await table.save()
    return {
      tableId: table.id,
      product: historyProduct,
    }
  }

  public static async updateEstablishmentTableStatus(
    id: EstablishmentTable['id'],
    inUse: boolean,
    userId: User['id']
  ) {
    const table = await EstablishmentTable.findOne(id, {
      relations: ['activeOrder', 'activeOrder.products'],
    })
    if (!table) throw new Error('Table not found')
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')

    table.inUse = inUse
    if (table.inUse) {
      table.activeOrder = Purchase.create()
      table.activeOrder.operator = user
      table.activeOrder.establishmentTable = table
      table.activeOrder.type = PurchaseType.RESTAURANT_ORDER
      table.activeOrder.origin = PurchaseOrigin.ESTABLISHMENT_TABLE
      await table.activeOrder.save()
    }
    if (
      !table.inUse &&
      table.activeOrder &&
      !table.activeOrder.products.length
    ) {
      table.activeOrder.establishmentTable = null
      await table.activeOrder.save()
      table.activeOrder = null
      await table.save()
      const purchasesToRemove = await Purchase.find({
        where: {
          origin: PurchaseOrigin.ESTABLISHMENT_TABLE,
          establishmentTable: null,
        },
      })
      await Purchase.remove(purchasesToRemove)
    }
    return table.save()
  }
}
