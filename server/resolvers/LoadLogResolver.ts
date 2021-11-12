import { Resolver, Query, Authorized, Arg, ID, Mutation } from 'type-graphql'
import { LoadLog } from '../models/LoadLog'
import { LoadLogService } from '../services/LoadLogService'
import { Role } from '../enums/Role'
import { POS } from '../models/POS'
import { CreateLoadLogInput } from '../inputs/CreateLoadLogInput'

@Resolver()
export class LoadLogResolver {
  @Query(() => [LoadLog])
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetLoadLogs() {
    return LoadLogService.getAll()
  }

  @Query(() => [LoadLog])
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetLoadLogsForPOS(@Arg('id', () => ID) id: POS['id']) {
    return LoadLogService.getForPOS(id)
  }

  @Mutation(() => LoadLog)
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public CreateLoadLog(
    @Arg('loadLog', () => CreateLoadLogInput) loadLog: CreateLoadLogInput
  ) {
    return LoadLogService.create(loadLog)
  }
}
