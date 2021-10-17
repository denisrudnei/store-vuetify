import { CreateEstablishmentTableInput } from '../inputs/CreateEstablishmentTableInput'
import { EstablishmentTable } from '../models/EstablishmentTable'

export class EstablishmentTableService {
  public static getTables() {
    return EstablishmentTable.find()
  }

  public static create(table: CreateEstablishmentTableInput) {
    const newTable = EstablishmentTable.create()
    Object.assign(newTable, table)
    return newTable.save()
  }

  public static async updateEstablishmentTableStatus(
    id: EstablishmentTable['id'],
    inUse: boolean
  ) {
    const table = await EstablishmentTable.findOne(id)
    if (!table) throw new Error('Table not found')
    table.inUse = inUse
    return table.save()
  }
}
