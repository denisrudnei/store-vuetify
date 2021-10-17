import { Query } from 'type-graphql'

import { EstablishmentTable } from '../models/EstablishmentTable'
import { EstablishmentTableService } from '../services/EstablishmentTableService'

export class EstablishmentTableResolver {
  @Query(() => [EstablishmentTable])
  public GetTables() {
    return EstablishmentTableService.getTables()
  }
}
