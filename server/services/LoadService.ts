import { PubSubEngine } from 'graphql-subscriptions'
import { Between, IsNull, Not } from 'typeorm'

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
import { SynchronizationResult } from '../models/SynchronizationResult'
import { Printer } from '../models/printer/Printer'
import { PrintLayout } from '../models/print_layout/PrintLayout'

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
      printers: await Printer.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
      }),
      printLayouts: await PrintLayout.find({
        where: {
          updatedAt: Between(lastUpdate, new Date()),
        },
      }),
      deleted: await this.getDeleted(lastUpdate),
    } as LoadData
  }

  public static async getDeleted(lastUpdate?: Date) {
    const deletedAt = lastUpdate
      ? Between(lastUpdate, new Date())
      : Not(IsNull())
    return {
      products: await Product.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
      users: await User.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
      categories: await Category.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
      pos: await POS.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
      printers: await Printer.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
      printLayouts: await PrintLayout.find({
        where: {
          deletedAt,
        },
        withDeleted: true,
      }),
    }
  }

  public static async loadSynchronously(
    data: LoadPayload
  ): Promise<SynchronizationResult> {
    const result: SynchronizationResult = SynchronizationResult.create({
      products: await this.synchronizeProductsSync(data.products),
      users: [],
      categories: [],
      purchases: [],
    })
    return result.save()
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

  public static async loadAsynchronously(
    data: LoadPayload,

    pubSub: PubSubEngine
  ): Promise<String> {
    const result = await SynchronizationResult.create({
      products: [],
      users: [],
      categories: [],
      purchases: [],
    }).save()
    this.synchronizeProductsAsync(data.products, result, pubSub)

    return result.id
  }

  public static async synchronizeProductsAsync(
    products: LoadPayload['products'],
    synchronizationResult: SynchronizationResult,
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

        synchronizationResult.products.push(success)
        synchronizationResult.save()

        pubSub.publish(LoadEvents.ITEM_SYNCHRONIZED, success)
      } catch (e) {
        const failed = await SynchronizationItemResult.create({
          itemId: product.id,
          status: SynchronizationStatus.UNSYNCHRONIZED,
          type: SynchronizationItemType.PRODUCT,
          reason: e instanceof Error ? e.message : 'Failed to save product',
          createdAt: new Date(),
        }).save()

        synchronizationResult.products.push(failed)
        synchronizationResult.save()

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
