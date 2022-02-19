import {
  Arg,
  Authorized,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { CreateSupplierInput } from '../inputs/supplier/CreateSupplierInput'
import { Supplier } from '../models/Supplier'
import { SupplierService } from '../services/SupplierService'
import { SupplierConnection } from '../types/pagination/supplier/SupplierPagination'

@Resolver(() => Supplier)
export class SupplierResolver {
  @Query(() => SupplierConnection)
  @Authorized(Role.ADMIN)
  public GetSuppliers(
    @Arg('page', () => Int, { nullable: true, defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 }) limit: number
  ) {
    return SupplierService.getSuppliers(page, limit)
  }

  @Mutation(() => Supplier)
  @Authorized(Role.ADMIN)
  public CreateSupplier(
    @Arg('supplier', () => CreateSupplierInput) supplier: CreateSupplierInput
  ) {
    return SupplierService.create(supplier)
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  public async RemoveSupplier(@Arg('id', () => ID) id: Supplier['id']) {
    await SupplierService.remove(id)
    return true
  }
}
