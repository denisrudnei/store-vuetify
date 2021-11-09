import { Between } from 'typeorm'

import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { User } from '../models/User'
import { LoadData } from '../types/LoadData'

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
    } as LoadData
  }
}
