import { PubSubEngine } from 'graphql-subscriptions'
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'

import { EstablishmentTableEvents } from '../enums/EstablishmentTableEvents'
import { Role } from '../enums/Role'
import { CreateEstablishmentTableInput } from '../inputs/CreateEstablishmentTableInput'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { EstablishmentTable } from '../models/EstablishmentTable'
import { EstablishmentTableService } from '../services/EstablishmentTableService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver(() => EstablishmentTable)
export class EstablishmentTableResolver {
  @Query(() => [EstablishmentTable])
  @Authorized(Role.OPERATOR)
  public GetTables() {
    return EstablishmentTableService.getTables()
  }

  @Query(() => EstablishmentTable)
  @Authorized(Role.OPERATOR)
  public GetTable(@Arg('id', () => ID) id: EstablishmentTable['id']) {
    return EstablishmentTableService.getOne(id)
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
  @Authorized(Role.OPERATOR)
  public async UpdateEstablishmentTableStatus(
    @Arg('id', () => ID) id: EstablishmentTable['id'],
    @Arg('inUse', () => Boolean) inUse: boolean,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: CustomExpressContext
  ) {
    const userId = req.session.authUser!.id
    const result =
      await EstablishmentTableService.updateEstablishmentTableStatus(
        id,
        inUse,
        userId
      )
    pubSub.publish(EstablishmentTableEvents.STATUS_UPDATED, result)
    return result
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public async RemoveEstablishmentTable(
    @Arg('id', () => ID) id: EstablishmentTable['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    const establishmentTable = await EstablishmentTable.findOne(id)
    if (!establishmentTable) throw new Error('Establishment table not found')
    await EstablishmentTable.softRemove(establishmentTable)
    pubSub.publish(EstablishmentTableEvents.TABLE_REMOVED, establishmentTable)
    return true
  }

  @Mutation(() => EstablishmentTable)
  @Authorized(Role.OPERATOR)
  public async AddItemToTable(
    @Arg('id', () => ID) id: EstablishmentTable['id'],
    @Arg('product', () => ProductForPurchaseInput)
    product: ProductForPurchaseInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const table = await EstablishmentTableService.addItem(id, product)
    pubSub.publish(EstablishmentTableEvents.ITEM_ADDED_TO_TABLE, table)
    return table
  }

  @FieldResolver()
  public async activeOrder(@Root() root: EstablishmentTable) {
    const { activeOrder } = (await EstablishmentTable.findOne(root.id, {
      relations: ['activeOrder'],
    })) as EstablishmentTable
    return activeOrder
  }

  @FieldResolver()
  public async orders(@Root() root: EstablishmentTable) {
    const { orders } = (await EstablishmentTable.findOne(root.id, {
      relations: ['orders'],
    })) as EstablishmentTable
    return orders
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

  @Subscription(() => EstablishmentTable, {
    topics: EstablishmentTableEvents.ITEM_ADDED_TO_TABLE,
  })
  public ItemAddedToTable(@Root() payload: EstablishmentTable) {
    return payload
  }
}
