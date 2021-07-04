import { Product } from '../models/Product'
import { Category } from '../models/Category'
import { CreateProductInput } from '../../inputs/CreateProductInput'

export class ProductService {
  public static getProducts() {
    return Product.find()
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

  public static async createProduct(productToCreate: CreateProductInput) {
    const product = Product.create()
    Object.assign(product, productToCreate)
    const category = await Category.findOne(productToCreate.category)
    if (!category) throw new Error('Category not found')
    product.category = category
    return product.save()
  }

  public static async inactive(id: Product['id']) {
    const product = await Product.findOne(id)
    if (!product) throw new Error('Product not found')
    Product.softRemove(product)
  }
}
