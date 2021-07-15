import { Category } from '../models/Category'
import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { EditCategoryInput } from '../inputs/EditCategoryInput'

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

  public static async edit(
    id: Category['id'],
    categoryToEdit: EditCategoryInput
  ) {
    const category = await Category.findOne(id, {
      relations: ['subCategories'],
    })
    if (!category) throw new Error('Category not found')
    const father = await Category.findOne(categoryToEdit.father)
    category.name = categoryToEdit.name
    category.description = categoryToEdit.description
    if (father && father.id !== category.id) {
      if (!category.subCategories.map((sub) => sub.id).includes(father.id)) {
        category.father = father
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
      )
        return `${category.father.name}/${category.name}`
      return `${await this.getFullName(category.father.id)}/${category.name}`
    }
    return category.name
  }
}
