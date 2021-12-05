import {
  getConnection,
  ILike,
  In,
  IsNull,
  Not,
  SelectQueryBuilder,
} from 'typeorm'

import { CreateProductInput } from '../inputs/CreateProductInput'
import { EditProductInput } from '../inputs/EditProductInput'
import { SearchProductInput } from '../inputs/SearchProductInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { S3 } from '../S3'
import { DeletedProductResult } from '../types/DeletedProductResult'
import { ProductPaginationConnection } from '../types/ProductPagination'

export class ProductService {
  public static getProducts() {
    return Product.find()
  }

  public static async getProductsPaginated(
    page: number,
    limit: number
  ): Promise<ProductPaginationConnection> {
    const [products, total] = await Product.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    const pages = Math.round(total / limit)

    return {
      total,
      edges: products.map((product) => ({
        cursor: product.id,
        node: product,
      })),
      pageInfo: {
        pages,
        page,
        endCursor: products[products.length - 1].id,
        hasNextPage: page < pages,
      },
    }
  }

  public static getProduct(id: Product['id']) {
    return Product.findOne(id)
  }

  public static getProductsByIds(ids: Product['id'][]) {
    return Product.findByIds(ids)
  }

  public static async searchProduct(
    search: SearchProductInput,
    page: number,
    limit: number
  ) {
    const where = (qb: SelectQueryBuilder<Product>) => {
      qb.where({
        name: ILike(`%${search.name ? search.name : ''}%`),
      })
        .andWhere(
          search.category ? 'product.categoryId = :category' : '1 = 1',
          {
            category: search.category,
          }
        )
        .andWhere(search.minPrice ? 'product.price >= :minPrice' : '1 = 1', {
          minPrice: search.minPrice,
        })
        .andWhere(search.maxPrice ? 'product.price <= :maxPrice' : '1 = 1', {
          maxPrice: search.maxPrice,
        })
        .andWhere(
          search.type && search.type.length > 0
            ? `product.type && '${search.type
                ?.map((type) => `{${type}}`)
                .join(',')}'`
            : '1 = 1'
        )
    }

    const result = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from(Product, 'product')
      .where(where)
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany()

    const products = result.map((item) => ({
      ...item,
      // @ts-ignore
      images: item.images.split(',').filter((image) => image.length),
    }))

    const total = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from(Product, 'product')
      .where(where)
      .getCount()
    const pages = Math.ceil(total / limit)

    return {
      edges: products.map((product) => ({
        node: product,
        cursor: product.id,
      })),
      total,
      pageInfo: {
        endCursor: products.length > 0 ?? products[products.length - 1].id,
        hasNextPage: page < pages,
        pages,
        page,
      },
    }
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

  public static async updateCategoryForProducts(
    products: Product['id'][],
    categoryId: Category['id']
  ) {
    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
    })
    if (!category) throw new Error('Category not found')
    await Product.update(
      {
        id: In(products),
      },
      {
        category,
      }
    )
    return products
  }

  public static async removeImage(productId: Product['id'], image: string) {
    const product = await Product.findOne(productId)
    if (!product) throw new Error('Product not found')
    const items = image.split('/')
    const name = items[items.length - 1]

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `product/${product.id}/${name}`,
    }

    await S3.deleteObject(params).promise()
    product.images = product.images.filter((item) => item !== image)
    product.imageUpdatedAt = new Date()
    await product.save()
    return true
  }
}
