import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { CreatePrinterInput } from '../inputs/printer/CreatePrinterInput'
import { Printer } from '../models/printer/Printer'
import { PrinterService } from '../services/PrinterService'

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

  @Mutation(() => Printer)
  @Authorized(Role.OPERATOR)
  public CreatePrinter(
    @Arg('printer', () => CreatePrinterInput) printer: CreatePrinterInput
  ) {
    return PrinterService.create(printer)
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
}
