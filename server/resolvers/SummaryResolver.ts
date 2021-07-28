import { Query, Authorized, Resolver, Arg, Int } from 'type-graphql'

import { SummaryItem } from '../models/summary/SummaryItem'
import { SummaryService } from '../services/SummaryService'
import { Role } from '../enums/Role'
import { DayCount } from '../models/summary/DayCount'

@Resolver()
export class SummaryResolver {
  @Query(() => [SummaryItem])
  @Authorized(Role.ADMIN)
  public GetSummary() {
    return SummaryService.allTime()
  }

  @Query(() => [DayCount])
  public GetPurchaseSummaryInMonth(
    @Arg('year', () => Int) year: number,
    @Arg('month', () => Int) month: number
  ) {
    return SummaryService.purchasesPerMonth(month, year)
  }
}
