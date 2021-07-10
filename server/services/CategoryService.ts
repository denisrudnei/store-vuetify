import { Category } from '../models/Category'
import { CreateCategoryInput } from '../../inputs/CreateCategoryInput'

export class CategoryService {
  public static getRootCategories() {
    return Category.find({
      where: {
        father: null,
      },
    })
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

  public static async getFullName(id: Category['id']): Promise<String> {
    const category = await Category.findOne(id, { relations: ['father'] })
    if (!category) throw new Error('Category not found')
    if (category.father) {
      return `${await this.getFullName(category.father.id)}/${category.name}`
    }
    return category.name
  }
}
