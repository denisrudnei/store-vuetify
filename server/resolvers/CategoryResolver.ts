import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import { Category } from '../models/Category'
import { CategoryService } from '../services/CategoryService'
import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { Role } from '../enums/Role'
import { EditCategoryInput } from '../inputs/EditCategoryInput'
import { Product } from '../models/Product'

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public GetCategories(
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean
  ) {
    return CategoryService.getRootCategories(withNoProducts)
  }

  @Query(() => [Category])
  public GetAllCategories(
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean
  ) {
    return CategoryService.getAllCategories(withNoProducts)
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
  @Authorized(Role.ADMIN)
  public CreateCategory(
    @Arg('category', () => CreateCategoryInput) category: CreateCategoryInput
  ) {
    return CategoryService.createCategory(category)
  }

  @Mutation(() => Category)
  @Authorized(Role.ADMIN)
  public EditCategory(
    @Arg('id', () => ID) id: Category['id'],
    @Arg('category', () => EditCategoryInput) category: EditCategoryInput
  ) {
    return CategoryService.edit(id, category)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public FixCategoriesSlug() {
    return CategoryService.fixCategoriesSlug()
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public RemoveCategoryImage(@Arg('id', () => ID) id: Category['id']) {
    return CategoryService.removeImage(id)
  }

  @FieldResolver()
  public async father(@Root() root: Category) {
    const { father } = (await Category.findOne(root.id, {
      relations: ['father'],
    })) as Category
    return father
  }

  @FieldResolver(() => String)
  public fullName(@Root() root: Category) {
    return CategoryService.getFullName(root.id)
  }

  @FieldResolver()
  public async subCategories(@Root() root: Category) {
    const { subCategories } = (await Category.findOne(root.id, {
      relations: ['subCategories'],
    })) as Category
    return subCategories
  }

  @FieldResolver(() => [Product])
  public products(@Root() root: Category) {
    return CategoryService.getProducts(root.id)
  }
}
