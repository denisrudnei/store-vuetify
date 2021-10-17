import { PubSubEngine } from 'graphql-subscriptions'
import {
  Query,
  Arg,
  Mutation,
  ID,
  Subscription,
  Root,
  PubSub,
} from 'type-graphql'
import { EstablishmentTableEvents } from '../enums/EstablishmentTableEvents'
import { CreateEstablishmentTableInput } from '../inputs/CreateEstablishmentTableInput'

import { EstablishmentTable } from '../models/EstablishmentTable'
import { EstablishmentTableService } from '../services/EstablishmentTableService'

export class EstablishmentTableResolver {
  @Query(() => [EstablishmentTable])
  public GetTables() {
    return EstablishmentTableService.getTables()
  }

  @Mutation(() => EstablishmentTable)
  public async CreateEstablishmentTable(
    @Arg('table', () => CreateEstablishmentTableInput)
    table: CreateEstablishmentTableInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await EstablishmentTableService.create(table)
    pubSub.publish(EstablishmentTableEvents.NEW_TABLE, result)
    return result
  }

  @Mutation(() => EstablishmentTable)
  public async UpdateEstablishmentTableStatus(
    @Arg('id', () => ID) id: EstablishmentTable['id'],
    @Arg('inUse', () => Boolean) inUse: boolean,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result =
      await EstablishmentTableService.updateEstablishmentTableStatus(id, inUse)
    pubSub.publish(EstablishmentTableEvents.STATUS_UPDATED, result)
    return result
  }

  @Subscription(() => EstablishmentTable, {
    topics: EstablishmentTableEvents.STATUS_UPDATED,
  })
  public EstablishmentTableStatusChanged(@Root() payload: EstablishmentTable) {
    return payload
  }

  @Subscription(() => EstablishmentTable, {
    topics: EstablishmentTableEvents.NEW_TABLE,
  })
  public EstablishmentTableCreated(@Root() payload: EstablishmentTable) {
    return payload
  }

  @Subscription(() => EstablishmentTable, {
    topics: EstablishmentTableEvents.TABLE_RESERVED,
  })
  public EstablishmentTableReserved(@Root() payload: EstablishmentTable) {
    return payload
  }

  @Subscription(() => EstablishmentTable, {
    topics: EstablishmentTableEvents.TABLE_REMOVED,
  })
  public EstablishmentTableRemoved(@Root() payload: EstablishmentTable) {
    return payload
  }
}
