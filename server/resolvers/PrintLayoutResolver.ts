import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Int,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { AddHeaderInput } from '../inputs/print_layout/AddHeaderInput'
import { CreatePrintLayoutInput } from '../inputs/print_layout/CreatePrintLayoutInput'
import { PrintLayout } from '../models/print/PrintLayout'
import { PrintLayoutItem } from '../models/print/PrintLayoutItem'
import { HeaderItem } from '../models/print/single_line/HeaderItem'
import { PrintLayoutService } from '../services/PrintLayoutService'
import { EmptyLineItem } from '../models/print/single_line/EmptyLineItem'
import { ProductTable } from '../models/print/single_line/ProductTable'
import { PurchaseType } from '../enums/PurchaseType'
import { LineItem } from '../models/print/single_line/LineItem'
import { CutItem } from '../models/print/single_line/CutItem'

@Resolver(() => PrintLayout)
export class PrintLayoutResolver {
  @Query(() => [PrintLayout])
  public GetPrintLayouts() {
    return PrintLayoutService.getAll()
  }

  @Query(() => PrintLayout)
  public GetPrintLayout(@Arg('id', () => ID) id: PrintLayout['id']) {
    return PrintLayoutService.getOne(id)
  }

  @Mutation(() => PrintLayout)
  @Authorized(Role.OPERATOR)
  public CreatePrintLayout(
    @Arg('layout', () => CreatePrintLayoutInput) layout: CreatePrintLayoutInput
  ) {
    return PrintLayoutService.create(layout)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public RemovePrintLayout(@Arg('id', () => ID) id: PrintLayout['id']) {
    return PrintLayoutService.remove(id)
  }

  @Mutation(() => HeaderItem)
  @Authorized(Role.OPERATOR)
  public AddHeaderInPrintLayout(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('header', () => AddHeaderInput) header: AddHeaderInput
  ) {
    return PrintLayoutService.addHeader(id, header)
  }

  @Mutation(() => EmptyLineItem)
  @Authorized(Role.OPERATOR)
  public AddEmptyLineInPrintLayout(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('lines', () => Int) lines: number
  ) {
    return PrintLayoutService.addEmptyLine(id, lines)
  }

  @Mutation(() => ProductTable)
  @Authorized(Role.OPERATOR)
  public AddProductTable(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('type', () => PurchaseType) type: PurchaseType
  ) {
    return PrintLayoutService.addProductTable(id, type)
  }

  @Mutation(() => LineItem)
  @Authorized(Role.OPERATOR)
  public AddLineItem(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('character', () => String) character: PurchaseType
  ) {
    return PrintLayoutService.addLineItem(id, character)
  }

  @Mutation(() => CutItem)
  @Authorized(Role.OPERATOR)
  public AddCutItem(@Arg('id', () => ID) id: PrintLayout['id']) {
    return PrintLayoutService.addCutItem(id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public ClearPrintLayout(@Arg('id', () => ID) id: PrintLayout['id']) {
    return PrintLayoutService.clearItems(id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public RemovePrintLayoutItem(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('item', () => ID) itemId: PrintLayoutItem['id']
  ) {
    return PrintLayoutService.removeItem(id, itemId)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public MoveItemPosition(
    @Arg('id', () => ID) id: PrintLayout['id'],
    @Arg('oldPosition', () => Int) oldPosition: number,
    @Arg('newPosition', () => Int) newPosition: number
  ) {
    return PrintLayoutService.updatePosition(id, oldPosition, newPosition)
  }

  @FieldResolver()
  public async items(@Root() root: PrintLayout) {
    const { items } = (await PrintLayout.findOne(root.id, {
      relations: ['items'],
    })) as PrintLayout
    return items.sort((a, b) => a.position - b.position)
  }
}
