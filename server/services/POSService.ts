import { POS } from '../models/POS'
import { CreatePOSInput } from '../inputs/CreatePOSInput'

export class POSService {
  public static getAll() {
    return POS.find()
  }

  public static getOnePOS(id: POS['id']) {
    return POS.findOne(id)
  }

  public static create(pos: CreatePOSInput) {
    const newPOS = POS.create()
    newPOS.name = pos.name
    return newPOS.save()
  }

  public static getByHostname(hostname: String) {
    return POS.findOne({
      where: {
        hostname,
      },
    })
  }

  public static getAvailablePOS() {
    return POS.find({
      where: {
        hostname: '',
      },
    })
  }

  public static async configure(id: POS['id'], hostname: string) {
    const pos = await POS.findOne(id)
    if (!pos) throw new Error('POS not found')

    if (pos.hostname !== '' && pos.hostname !== hostname) {
      throw new Error(`POS already configured in ${pos.hostname}`)
    }

    pos.hostname = hostname
    return pos.save()
  }
}
