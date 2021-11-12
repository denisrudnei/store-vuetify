import { LoadLog } from '../models/LoadLog'
import { POS } from '../models/POS'
import { CreateLoadLogInput } from '../inputs/CreateLoadLogInput'
export class LoadLogService {
  public static getAll() {
    return LoadLog.find()
  }

  public static getForPOS(id: POS['id']) {
    return LoadLog.find({
      where: {
        pos: {
          id,
        },
      },
    })
  }

  public static async create(loadLog: CreateLoadLogInput) {
    const pos = await POS.findOne({
      where: {
        id: loadLog.pos,
      },
    })
    if (!pos) throw new Error('POS not found')
    const newLoadLog = LoadLog.create()
    newLoadLog.pos = pos
    newLoadLog.message = loadLog.message
    return newLoadLog.save()
  }
}
