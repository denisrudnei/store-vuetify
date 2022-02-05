import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'

import { PubSubEngine } from 'graphql-subscriptions'
import { Role } from '../enums/Role'
import { CreatePrinterInput } from '../inputs/printer/CreatePrinterInput'
import { Printer } from '../models/printer/Printer'
import { PrinterService } from '../services/PrinterService'
import { PrinterType } from '../enums/PrinterType'
import { UpdatePrinterInput } from '../inputs/printer/UpdatePrinterInput'
import { PrinterEvents } from '../enums/PrinterEvents'

@Resolver(() => Printer)
export class PrinterResolver {
  @Query(() => [Printer])
  @Authorized(Role.OPERATOR)
  public GetAllPrinters() {
    return PrinterService.getAll()
  }

  @Query(() => Printer)
  @Authorized(Role.OPERATOR)
  public GetOnePrinter(@Arg('id', () => ID) id: Printer['id']) {
    return PrinterService.getOne(id)
  }

  @Query(() => [String])
  @Authorized(Role.ADMIN, Role.OPERATOR)
  GetPrinterTypes() {
    return Object.values(PrinterType)
  }

  @Query(() => [Printer])
  @Authorized(Role.ADMIN, Role.OPERATOR)
  GetPrinterByType(@Arg('type', () => PrinterType) type: PrinterType) {
    return PrinterService.getPrinterByType(type)
  }

  @Mutation(() => Printer)
  @Authorized(Role.OPERATOR)
  public async CreatePrinter(
    @Arg('printer', () => CreatePrinterInput) printer: CreatePrinterInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await PrinterService.create(printer)
    pubSub.publish(PrinterEvents.NEW_PRINTER, result)
    return result
  }

  @Mutation(() => Printer)
  @Authorized(Role.ADMIN, Role.OPERATOR)
  public async UpdatePrinter(
    @Arg('id', () => ID) id: Printer['id'],
    @Arg('printer', () => UpdatePrinterInput) printer: UpdatePrinterInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await PrinterService.updatePrinter(id, printer)
    pubSub.publish(PrinterEvents.PRINTER_UPDATED, result)
    return result
  }

  @Mutation(() => Printer)
  @Authorized(Role.OPERATOR)
  public UpdatePrinterPath(
    @Arg('id', () => ID) id: Printer['id'],
    @Arg('path', () => String) path: string
  ) {
    return PrinterService.updatePath(id, path)
  }

  @Mutation(() => Printer)
  @Authorized(Role.OPERATOR)
  public UpdatePrinterManufacturer(
    @Arg('id', () => ID) id: Printer['id'],
    @Arg('manufacturer', () => String) manufacturer: string
  ) {
    return PrinterService.updateManufacturer(id, manufacturer)
  }

  @Mutation(() => Printer)
  @Authorized(Role.OPERATOR)
  public UpdatePrinterModel(
    @Arg('id', () => ID) id: Printer['id'],
    @Arg('model', () => String) model: string
  ) {
    return PrinterService.updateModel(id, model)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public RemovePrinter(@Arg('id', () => ID) id: Printer['id']) {
    return PrinterService.remove(id)
  }

  @FieldResolver()
  public async installedIn(@Root() root: Printer) {
    const { installedIn } = (await Printer.findOne(root.id, {
      relations: ['installedIn'],
    })) as Printer
    return installedIn
  }

  @Subscription(() => Printer, {
    topics: PrinterEvents.PRINTER_UPDATED,
  })
  public PrinterUpdated(@Root() payload: Printer) {
    return payload
  }

  @Subscription(() => Printer, {
    topics: PrinterEvents.NEW_PRINTER,
  })
  public NewPrinter(@Root() payload: Printer) {
    return payload
  }
}
