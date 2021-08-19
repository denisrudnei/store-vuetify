import {
  Query,
  Authorized,
  Resolver,
  Arg,
  Int,
  Subscription,
  Root,
} from 'type-graphql'

import { SummaryItem } from '../models/summary/SummaryItem'
import { SummaryService } from '../services/SummaryService'
import { Role } from '../enums/Role'
import { DayCount } from '../models/summary/DayCount'
import { SummaryEvents } from '../enums/SummaryEvents'

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

  @Subscription(() => Boolean, {
    topics: SummaryEvents.UPDATE_SUMMARY,
    filter: ({ context }) => {
      if (!context.req || !context.req.authUser) return false
      return context.req.authUser.role === Role.ADMIN
    },
  })
  public UpdateSummary(@Root() payload: Boolean) {
    return payload
  }
}
