import { EstablishmentTable } from '../models/EstablishmentTable'

export class EstablishmentTableService {
  public static getTables() {
    return EstablishmentTable.find()
  }
}
