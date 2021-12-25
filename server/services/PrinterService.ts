import { CreatePrinterInput } from '../inputs/printer/CreatePrinterInput'
import { Printer } from '../models/printer/Printer'
import { POS } from '../models/POS'

export class PrinterService {
  public static async create(printer: CreatePrinterInput) {
    const pos = await POS.findOne(printer.installedIn)
    if (!pos) throw new Error('POS not found')
    return Printer.create({
      name: printer.name,
      path: printer.path,
      manufacturer: printer.manufacturer,
      model: printer.model,
      installedIn: pos,
    }).save()
  }

  public static getAll() {
    return Printer.find()
  }

  public static async getOne(id: Printer['id']) {
    const printer = await Printer.findOne(id)
    if (!printer) throw new Error('Printer not found')
    return printer
  }

  public static async remove(id: Printer['id']) {
    const printer = await Printer.findOne(id)
    if (!printer) throw new Error('Printer not found')
    await Printer.softRemove(printer)
    return true
  }

  public static async updatePath(id: Printer['id'], path: string) {
    const printer = await Printer.findOne(id)
    if (!printer) throw new Error('Printer not found')
    printer.path = path
    return printer.save()
  }

  public static async updateManufacturer(
    id: Printer['id'],
    manufacturer: string
  ) {
    const printer = await Printer.findOne(id)
    if (!printer) throw new Error('Printer not found')
    printer.manufacturer = manufacturer
    return printer.save()
  }

  public static async updateModel(id: Printer['id'], model: string) {
    const printer = await Printer.findOne(id)
    if (!printer) throw new Error('Printer not found')
    printer.model = model
    return printer.save()
  }
}
