import { set, lastDayOfMonth, getDaysInMonth } from 'date-fns'
import { getConnection } from 'typeorm'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'

export class SummaryService {
  public static async allTime() {
    const totalSold = await Promise.all(
      (await Purchase.find()).map((purchase) => purchase.totalPrice())
    )

    return [
      {
        name: 'Purchases',
        value: await Purchase.count(),
      },
      {
        name: 'Users',
        value: await User.count(),
      },
      {
        name: 'Products',
        value: await Product.count(),
      },
      {
        name: 'Categories',
        value: await Category.count(),
      },
      {
        name: 'Total sold',
        value: totalSold.reduce((acc, item) => (acc += Number(item)), 0),
      },
    ]
  }

  public static async purchasesPerMonth(month: number, year: number) {
    const first = set(new Date(), {
      year,
      month,
      date: 1,
    })

    const last = lastDayOfMonth(first)

    const result = await getConnection()
      .createQueryBuilder()
      .select('count(*) as total')
      .addSelect('extract(day from "createdAt") as day')
      .from(Purchase, 'purchase')
      .where('"createdAt" between :start and :finish', {
        start: first,
        finish: last,
      })
      .groupBy('day')
      .getRawMany()

    const days = Array.from(
      {
        length: getDaysInMonth(first),
      },
      (_, i) => (i += 1)
    )

    return days.map((day) => {
      const existing = result.find((item) => item.day === day)
      return {
        day: set(first, {
          date: day,
        }),
        total: existing ? existing.total : 0,
      }
    })
  }
}
