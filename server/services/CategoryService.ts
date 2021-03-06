import { In, SelectQueryBuilder } from 'typeorm'
import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { EditCategoryInput } from '../inputs/EditCategoryInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { S3 } from '../S3'
import { ProductPaginationConnection } from '../types/pagination/product/ProductPagination'
import { ProductType } from '../enums/ProductType'
import { CategoryPagination } from '../types/pagination/category/CategoryPagination'
import { convertProductTypesToPostgresString } from '../util/enum-util'

export const filterByType =
  (productsTypes: ProductType[]) => (category: Category) => {
    for (const type of productsTypes) {
      if (category.productsTypes.includes(type)) return true
    }
    return false
  }
export class CategoryService {
  public static async getAllCategories(
    withNoProducts: Boolean = false,
    productsTypes: ProductType[] = [ProductType.ECOMMERCE],
    page: number = 1,
    limit: number = 10
  ): Promise<CategoryPagination> {
    const where = (qb: SelectQueryBuilder<Category>) => {
      qb.where(
        `"productsTypes" && ${convertProductTypesToPostgresString(
          productsTypes
        )}`
      )
    }
    const [categories, total] = await Category.findAndCount({
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      where,
    })

    const pages = Math.round(total / limit)

    return {
      total,
      edges: categories.map((category) => ({
        cursor: category.id,
        node: category,
      })),
      pageInfo: {
        page,
        pages,
        endCursor: categories[categories.length - 1].id,
        hasNextPage: page < pages,
      },
    }
  }

  public static async getRootCategories(
    withNoProducts: Boolean = false,
    productsTypes: ProductType[] = [ProductType.ECOMMERCE],
    page: number = 1,
    limit: number = 10
  ): Promise<CategoryPagination> {
    const where = (qb: SelectQueryBuilder<Category>) => {
      qb.where([])
        .andWhere('Category.fatherId is null')
        .andWhere(
          `Category.productsTypes && ${convertProductTypesToPostgresString(
            productsTypes
          )}`
        )
    }
    const [categories, total] = await Category.findAndCount({
      relations: ['products', 'father'],
      skip: (page - 1) * limit,
      take: limit,
      where,
    })

    const pages = Math.round(total / limit)

    return {
      total,
      edges: categories.map((category) => ({
        cursor: category.id,
        node: category,
      })),
      pageInfo: {
        page,
        pages,
        endCursor:
          categories.length > 0 ? categories[categories.length - 1].id : '',
        hasNextPage: page < pages,
      },
    }
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
    if (categoryToEdit.productsTypes) {
      await this.editTypeForCategory(
        category.id,
        categoryToEdit.productsTypes,
        categoryToEdit.applyToSubs != null ? categoryToEdit.applyToSubs : false
      )
    }
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

  public static async getAllSubsRecursive(
    id: Category['id']
  ): Promise<Category[]> {
    const subs: Category[] = []
    const category = await Category.findOne(id, {
      relations: ['subCategories'],
    })
    if (!category) throw new Error('Category not found')
    if (category.subCategories.length === 0) return []
    for (const sub of category.subCategories) {
      subs.push(...(await this.getAllSubsRecursive(sub.id)))
    }
    return subs
  }

  public static async getProducts(
    id: Category['id'],
    limit: number = 10,
    page: number = 1
  ): Promise<ProductPaginationConnection> {
    // FIXME

    const subsIds = (await this.getAllSubsRecursive(id)).map((sub) => sub.id)

    const [products, total] = await Product.findAndCount({
      where: {
        category: In(subsIds),
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    const pages = Math.round(total / limit)

    return {
      total,
      pageInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        endCursor: products.length > 0 ? products[products.length - 1].id : '',
      },
      edges: products.map((product) => ({
        cursor: product.id,
        node: product,
      })),
    }
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

  public static async editTypeForCategory(
    id: Category['id'],
    types: ProductType[],
    applyToSubs: boolean = false
  ) {
    const category = await Category.findOne(id, {
      relations: ['subCategories'],
    })
    if (!category) throw new Error('Category not found')
    category.productsTypes = types

    await Product.update(
      {
        category: {
          id,
        },
      },
      {
        type: types,
      }
    )

    if (applyToSubs && category.subCategories.length) {
      await Promise.all(
        category.subCategories.map((sub) =>
          this.editTypeForCategory(sub.id, types, true)
        )
      )
    }
    return category.save()
  }
}
