import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import { Category } from '../models/Category'
import { CategoryService } from '../services/CategoryService'
import { CreateCategoryInput } from '../../inputs/CreateCategoryInput'

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public GetCategories() {
    return CategoryService.getRootCategories()
  }

  @Query(() => [Category])
  public GetAllCategories() {
    return Category.find()
  }

  @Query(() => [Category])
  public GetSubCategories(@Arg('id', () => ID) id: Category['id']) {
    return CategoryService.getSubCategories(id)
  }

  @Query(() => Category)
  public GetCategoryByName(@Arg('name', () => String) name: Category['name']) {
    return CategoryService.getCategoryByName(name)
  }

  @Mutation(() => Category)
  public CreateCategory(
    @Arg('category', () => CreateCategoryInput) category: CreateCategoryInput
  ) {
    return CategoryService.createCategory(category)
  }

  @FieldResolver()
  public async father(@Root() root: Category) {
    const { father } = (await Category.findOne(root.id, {
      relations: ['father'],
    })) as Category
    return father
  }

  @FieldResolver()
  public async subCategories(@Root() root: Category) {
    const { subCategories } = (await Category.findOne(root.id, {
      relations: ['subCategories'],
    })) as Category
    return subCategories
  }

  @FieldResolver()
  public async products(@Root() root: Category) {
    const { products } = (await Category.findOne(root.id, {
      relations: ['products'],
    })) as Category
    return products
  }
}
