import { Arg, Authorized, Query, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { LoadService } from '../services/LoadService'
import { LoadData } from '../types/LoadData'

@Resolver()
export class LoadResolver {
  @Query(() => LoadData)
  @Authorized(Role.OPERATOR)
  public GetLastRecentData(@Arg('lastUpdate', () => Date) lastUpdate: Date) {
    return LoadService.getRecentData(lastUpdate)
  }
}
