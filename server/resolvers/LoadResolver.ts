import { PubSubEngine } from 'graphql-subscriptions'
import {
  Arg,
  Authorized,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'

import { LoadEvents } from '../enums/LoadEvents'
import { Role } from '../enums/Role'
import { SynchronizationItemResult } from '../models/SynchronizationItemResult'
import { LoadService } from '../services/LoadService'
import { LoadData } from '../types/LoadData'
import { LoadPayload } from '../types/LoadPayload'
import { SynchronizationResult } from '../models/SynchronizationResult'
import { DeletedData } from '../types/DeletedData'

@Resolver()
export class LoadResolver {
  @Query(() => LoadData)
  @Authorized(Role.OPERATOR)
  public GetLastRecentData(@Arg('lastUpdate', () => Date) lastUpdate: Date) {
    return LoadService.getRecentData(lastUpdate)
  }

  @Query(() => DeletedData)
  @Authorized(Role.OPERATOR)
  public GetDeletedData() {
    return LoadService.getDeleted()
  }

  @Mutation(() => SynchronizationResult)
  public LoadSynchronously(@Arg('data', () => LoadPayload) data: LoadPayload) {
    return LoadService.loadSynchronously(data)
  }

  @Mutation(() => String)
  public async LoadAsynchronously(
    @Arg('data', () => LoadPayload) data: LoadPayload,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await LoadService.loadAsynchronously(data, pubSub)
    return result
  }

  @Subscription(() => SynchronizationItemResult, {
    topics: LoadEvents.ITEM_SYNCHRONIZED,
  })
  public ItemSynchronized(@Root() payload: SynchronizationItemResult) {
    return payload
  }

  @Subscription(() => SynchronizationItemResult, {
    topics: LoadEvents.ITEM_SYNCHRONIZED,
  })
  public ProductsSynchronized(@Root() payload: [SynchronizationItemResult]) {
    return payload
  }
}
