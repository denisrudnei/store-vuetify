import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { EditCategoryInput } from '../inputs/EditCategoryInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { S3 } from '../S3'
import { ProductPaginationConnection } from '../types/ProductPagination'

export class CategoryService {
  public static async getAllCategories(withNoProducts: Boolean = false) {
    const categories = await Category.find({ relations: ['products'] })
    if (withNoProducts) return categories
    return categories.filter((category) => category.products.length)
  }

  public static async getRootCategories(withNoProducts: Boolean = false) {
    const categories = await Category.find({
      relations: ['products'],
      where: {
        father: null,
      },
    })
    if (withNoProducts) return categories
    return categories.filter((category) => category.products.length)
  }

  public static async getCategory(id: Category['id']) {
    const category = await Category.findOne(id)
    if (!category) throw new Error('Category not found')
    return category
  }

  public static async getCategoryByName(name: Category['name']) {
    const category = await Category.findOne({
      where: {
        slug: name,
      },
    })
    if (!category) throw new Error('Category not found')
    return category
  }

  public static getSubCategories(id: Category['id']) {
    return Category.find({
      where: {
        father: id,
      },
    })
  }

  public static async createCategory(categoryToCreate: CreateCategoryInput) {
    const category = Category.create()
    Object.assign(category, categoryToCreate)
    const father = await Category.findOne(categoryToCreate.father)
    if (categoryToCreate.father && father) {
      category.father = father
    }
    return category.save()
  }

  public static async edit(
    id: Category['id'],
    categoryToEdit: EditCategoryInput
  ) {
    const category = await Category.findOne(id, {
      relations: ['subCategories'],
    })
    if (!category) throw new Error('Category not found')

    category.name = categoryToEdit.name
    category.description = categoryToEdit.description
    if (!categoryToEdit.father) {
      category.father = null
    } else {
      const father = await Category.findOne(categoryToEdit.father)
      if (father && father.id !== category.id) {
        if (!category.subCategories.map((sub) => sub.id).includes(father.id)) {
          category.father = father
        }
      }
    }

    return category.save()
  }

  public static async getFullName(id: Category['id']): Promise<String> {
    const category = await Category.findOne(id, {
      relations: ['father', 'father.subCategories', 'subCategories'],
    })
    if (!category) throw new Error('Category not found')
    if (category.father) {
      if (category.father.id === category.id) return ''
      if (
        category.subCategories.map((sub) => sub.id).includes(category.father.id)
      ) {
        return `${category.father.name}|slash|${category.name}`
      }
      const fullName = await this.getFullName(category.father.id)
      return `${fullName}|slash|${category.name}`
    }
    return category.name
  }

  public static async fixCategoriesSlug() {
    const categories = await Category.find()
    await Promise.all(
      categories.map((category) => {
        category.update()
        return category.save()
      })
    )
    return true
  }

  public static async removeImage(id: Category['id']) {
    const category = await Category.findOne(id)
    if (!category) throw new Error('Category not found')
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `category/${category.id}`,
    }

    await S3.deleteObject(params).promise()

    await Category.update(
      {
        id,
      },
      {
        image: '/images/not-set.svg',
      }
    )

    return true
  }

  public static async getProducts(
    id: Category['id'],
    limit: number = 10,
    page: number = 1
  ): Promise<Product[]> {
    const { subCategories } = (await Category.findOne(id, {
      relations: ['products', 'subCategories'],
    })) as Category
    const products = await Product.find({
      where: {
        category: id,
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    if (!products.length && !subCategories.length) return []
    if (!products.length) {
      const productsInSubCategories: Product[] = []

      for (const sub of subCategories) {
        productsInSubCategories.push(
          ...(await this.getProducts(sub.id, limit, page))
        )
      }
      return await Promise.all(productsInSubCategories)
    }
    return products
  }

  public static async getProductsPaginated(
    id: Category['id'],
    limit: number = 10,
    page: number = 1
  ): Promise<ProductPaginationConnection> {
    const { subCategories } = (await Category.findOne(id, {
      relations: ['products', 'subCategories'],
    })) as Category
    const [products, total] = await Product.findAndCount({
      where: {
        category: id,
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    const pages = Math.round(total / limit)

    if (!products.length && !subCategories.length)
      return {
        total: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          page: 1,
          pages: 0,
          endCursor: 0,
        },
      }
    if (!products.length) {
      const productsInSubCategories: ProductPaginationConnection = {
        total: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          page: 1,
          pages: 0,
          endCursor: 0,
        },
      }

      for (const sub of subCategories) {
        const resultForSub = await this.getProductsPaginated(
          sub.id,
          limit,
          page
        )
        productsInSubCategories.total += resultForSub.total
        productsInSubCategories.edges.push(...resultForSub.edges)
        productsInSubCategories.pageInfo.pages += resultForSub.pageInfo.pages
        productsInSubCategories.pageInfo.endCursor =
          resultForSub.pageInfo.endCursor
      }
      return productsInSubCategories
    }
    return {
      total,
      edges: products.map((product) => ({
        node: product,
        cursor: product.id,
      })),
      pageInfo: {
        hasNextPage: page < pages,
        page,
        pages,
        endCursor: products[products.length - 1].id,
      },
    }
  }
}
