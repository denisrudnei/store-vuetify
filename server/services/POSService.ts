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
}
