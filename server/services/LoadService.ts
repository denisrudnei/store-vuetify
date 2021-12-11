import { PubSubEngine } from 'graphql-subscriptions'
import { Between } from 'typeorm'

import { LoadEvents } from '../enums/LoadEvents'
import { SynchronizationItemType } from '../enums/SynchronizationItemType'
import { SynchronizationStatus } from '../enums/SynchronizationStatus'
import { SyncProductInput } from '../inputs/synchronize/SyncProductInput'
import { Category } from '../models/Category'
import { POS } from '../models/POS'
import { Product } from '../models/Product'
import { SynchronizationItemResult } from '../models/SynchronizationItemResult'
import { User } from '../models/User'
import { LoadData } from '../types/LoadData'
import { LoadPayload } from '../types/LoadPayload'
import { SynchronizationResult } from '../types/SynchronizationResult'

export class LoadService {
  public static async getRecentData(lastUpdate: Date) {
    return {
      products: await Product.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
        withDeleted: true,
      }),
      users: await User.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
        withDeleted: true,
      }),
      categories: await Category.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
        withDeleted: true,
      }),
      pos: await POS.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
      }),
    } as LoadData
  }

  public static async loadSynchronously(
    data: LoadPayload
  ): Promise<SynchronizationResult> {
    const result: SynchronizationResult = {
      products: await this.synchronizeProductsSync(data.products),
      users: [],
      categories: [],
      purchases: [],
    }
    return result
  }

  public static async synchronizeProductsSync(
    products: LoadPayload['products']
  ): Promise<SynchronizationItemResult[]> {
    const result: SynchronizationItemResult[] = []
    if (!products) return result
    for (const product of products) {
      try {
        await this.saveProduct(product)

        const success = await SynchronizationItemResult.create({
          itemId: product.id,
          status: SynchronizationStatus.SYNCHRONIZED,
          type: SynchronizationItemType.PRODUCT,
          reason: 'Success',
        }).save()

        result.push(success)
      } catch (e) {
        const failed = await SynchronizationItemResult.create({
          itemId: product.id,
          status: SynchronizationStatus.UNSYNCHRONIZED,
          type: SynchronizationItemType.PRODUCT,
          reason: e instanceof Error ? e.message : 'Failed to save product',
          createdAt: new Date(),
        }).save()

        result.push(failed)
      }
    }

    return result
  }

  public static loadAsynchronously(
    data: LoadPayload,
    id: string,
    pubSub: PubSubEngine
  ): String {
    this.synchronizeProductsAsync(data.products, pubSub)

    return id
  }

  public static async synchronizeProductsAsync(
    products: LoadPayload['products'],
    pubSub: PubSubEngine
  ) {
    if (!products) return []
    for (const product of products) {
      try {
        await this.saveProduct(product)

        const success = await SynchronizationItemResult.create({
          itemId: product.id,
          type: SynchronizationItemType.PRODUCT,
          status: SynchronizationStatus.SYNCHRONIZED,
          reason: 'Success',
          createdAt: new Date(),
        }).save()

        pubSub.publish(LoadEvents.ITEM_SYNCHRONIZED, success)
      } catch (e) {
        const failed = await SynchronizationItemResult.create({
          itemId: product.id,
          status: SynchronizationStatus.UNSYNCHRONIZED,
          type: SynchronizationItemType.PRODUCT,
          reason: e instanceof Error ? e.message : 'failed to save product',
          createdAt: new Date(),
        }).save()

        pubSub.publish(LoadEvents.ITEM_SYNCHRONIZED, failed)
      }
    }

    pubSub.publish(LoadEvents.PRODUCTS_SYNCHRONIZED, [])
  }

  public static async saveProduct(product: SyncProductInput) {
    const inDb = await Product.findOne(product.id)
    if (!inDb) return Promise.reject(Error('Product not found'))

    const category = await Category.findOne(product.category)
    if (!category) return Promise.reject(Error('Category not found'))

    const newProduct = {
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      description: product.description,
      amount: product.amount,
      price: product.price,
      type: product.type,
      category,
    }

    await Product.create(
      Object.assign(inDb, this.clean(newProduct)) as Product
    ).save()
  }

  public static clean(object: any) {
    for (const property in object) {
      if (object[property] === null || object[property] === undefined) {
        delete object[property]
      }
    }
    return object
  }
}
