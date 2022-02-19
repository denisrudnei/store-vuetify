import { CreateSupplierInput } from '../inputs/supplier/CreateSupplierInput'
import { Supplier } from '../models/Supplier'
import { SupplierConnection } from '../types/pagination/supplier/SupplierPagination'
import { Address } from '../models/Address'

export class SupplierService {
  public static async create(supplier: CreateSupplierInput) {
    const newSupplier = Supplier.create()
    newSupplier.name = supplier.name
    newSupplier.cnpj = supplier.cnpj
    newSupplier.ie = supplier.ie ?? ''

    if (supplier.address) {
      newSupplier.address = (await Address.findOne(supplier.address)) as Address
    }

    return newSupplier.save()
  }

  public static async getSuppliers(
    page: number = 1,
    limit: number = 10
  ): Promise<SupplierConnection> {
    const [suppliers, total] = await Supplier.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })
    const pages = Math.round(total / limit)
    return {
      total,
      edges: suppliers.map((supplier) => ({
        cursor: supplier.id,
        node: supplier,
      })),
      pageInfo: {
        pages,
        page,
        endCursor:
          suppliers.length === 0 ? '' : suppliers[suppliers.length - 1].id,
        hasNextPage: page < pages,
      },
    }
  }

  public static async remove(id: Supplier['id']) {
    const supplier = await Supplier.findOne(id)
    if (!supplier) throw new Error('Supplier not found')
    await supplier.softRemove()
  }
}
