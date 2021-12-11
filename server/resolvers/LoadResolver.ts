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
import { v4 as uuid } from 'uuid'

import { LoadEvents } from '../enums/LoadEvents'
import { Role } from '../enums/Role'
import { SynchronizationItemResult } from '../models/SynchronizationItemResult'
import { LoadService } from '../services/LoadService'
import { LoadData } from '../types/LoadData'
import { LoadPayload } from '../types/LoadPayload'
import { SynchronizationResult } from '../types/SynchronizationResult'

@Resolver()
export class LoadResolver {
  @Query(() => LoadData)
  @Authorized(Role.OPERATOR)
  public GetLastRecentData(@Arg('lastUpdate', () => Date) lastUpdate: Date) {
    return LoadService.getRecentData(lastUpdate)
  }

  @Mutation(() => SynchronizationResult)
  public LoadSynchronously(@Arg('data', () => LoadPayload) data: LoadPayload) {
    return LoadService.loadSynchronously(data)
  }

  @Mutation(() => String)
  public LoadAsynchronously(
    @Arg('data', () => LoadPayload) data: LoadPayload,
    @PubSub() pubSub: PubSubEngine
  ) {
    const id = uuid()
    LoadService.loadAsynchronously(data, id, pubSub)
    return id
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
