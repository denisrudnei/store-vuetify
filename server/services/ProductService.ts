import { In, IsNull, Not } from 'typeorm'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import { CreateProductInput } from '../../inputs/CreateProductInput'
import { EditProductInput } from '../../inputs/EditProductInput'
import { DeletedProductResult } from '../types/DeletedProductResult'

export class ProductService {
  public static getProducts() {
    return Product.find()
  }

  public static getProduct(id: Product['id']) {
    return Product.findOne(id)
  }

  public static async getProductsForCategory(name: Category['name']) {
    const category = await Category.findOne({
      where: {
        name,
      },
      relations: ['products'],
    })
    if (!category) throw new Error('Category not found')
    return category.products
  }

  public static getInactivatedProducts() {
    return Product.find({
      where: {
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    })
  }

  public static async createProduct(productToCreate: CreateProductInput) {
    const product = Product.create()
    Object.assign(product, productToCreate)
    const category = await Category.findOne(productToCreate.category)
    if (!category) throw new Error('Category not found')
    product.category = category
    return product.save()
  }

  public static async editProduct(
    id: Product['id'],
    productToEdit: EditProductInput
  ) {
    const product = await Product.findOne(id)
    if (!product) throw new Error('Product not found')
    Object.assign(product, productToEdit)
    product.category = await Category.findOne(productToEdit.category)
    return product.save()
  }

  public static async inactivate(id: Product['id']) {
    const product = await Product.findOne(id)
    if (!product) throw new Error('Product not found')
    await Product.softRemove(product)
    return true
  }

  public static async inactivateMany(ids: Product['id'][]) {
    const products = await Product.findByIds(ids)
    await Product.softRemove(products)
    return true
  }

  public static async reactivate(id: Product['id']) {
    const product = await Product.findOne(id, { withDeleted: true })
    if (!product) throw new Error('Product not found')
    await Product.update({ id }, { deletedAt: undefined })
    return true
  }

  public static async reactivateMany(ids: Product['id'][]) {
    await Product.update({ id: In(ids) }, { deletedAt: undefined })
    return true
  }

  public static async deleteProduct(id: Product['id']) {
    const product = await Product.findOne({
      where: {
        id,
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    })
    if (!product) return false
    await product.remove()
    return true
  }

  public static async deleteProducts(
    ids: Product['id'][]
  ): Promise<DeletedProductResult[]> {
    const products = await Product.find({
      where: {
        id: In(ids),
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    })
    await Promise.all(products.map((product) => product.remove()))
    const productsInDb = await Product.find({
      where: {
        id: In(ids),
      },
      withDeleted: true,
    })
    return ids.map((id) => {
      return {
        id,
        deleted: !productsInDb.map((product) => product.id).includes(id),
      }
    })
  }
}
