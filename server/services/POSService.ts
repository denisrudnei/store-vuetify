import { POS } from '../models/POS'
import { CreatePOSInput } from '../inputs/CreatePOSInput'
import { PrinterService } from './PrinterService'

export class POSService {
  public static getAll() {
    return POS.find()
  }

  public static getOnePOS(id: POS['id']) {
    return POS.findOneBy({ id })
  }

  public static create(pos: CreatePOSInput) {
    const newPOS = POS.create()
    newPOS.name = pos.name
    return newPOS.save()
  }

  public static getByHostname(hostname: string) {
    return POS.findOne({
      where: {
        hostname,
      },
    })
  }

  public static getAvailablePOS(hostname: string = '') {
    return POS.findBy({
      hostname,
    })
  }

  public static async configure(id: POS['id'], hostname: string) {
    const pos = await POS.findOneBy({ id })
    if (!pos) throw new Error('POS not found')

    if (pos.hostname !== '' && pos.hostname !== hostname) {
      throw new Error(`POS already configured in ${pos.hostname}`)
    }

    pos.hostname = hostname
    return pos.save()
  }

  public static async remove(id: POS['id']) {
    const pos = await POS.findOne({
      where: {
        id,
      },
      relations: ['printers'],
    })
    if (!pos) throw new Error('POS not found')
    await PrinterService.removeMany(pos.printers.map((printer) => printer.id))
    await pos.softRemove()
    return true
  }
}
