import {
  Arg,
  Args,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Ctx,
} from 'type-graphql'

import { SearchArgs } from '../args/SearchArgs'
import { Role } from '../enums/Role'
import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { EditCategoryInput } from '../inputs/EditCategoryInput'
import { Category } from '../models/Category'
import { CategoryService, filterByType } from '../services/CategoryService'
import { ProductPaginationConnection } from '../types/ProductPagination'
import { ProductType } from '../enums/ProductType'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  public GetCategories(
    @Ctx() { req }: CustomExpressContext,
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean,
    @Arg('type', () => [ProductType], { nullable: true })
    type = [ProductType.ECOMMERCE]
  ) {
    if (req.session.authUser && req.session.authUser!.role === Role.ADMIN) {
      type = Object.values(ProductType)
    }
    return CategoryService.getRootCategories(withNoProducts, type)
  }

  @Query(() => [Category])
  public GetAllCategories(
    @Ctx() { req }: CustomExpressContext,
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean,
    @Arg('type', () => [ProductType], { nullable: true })
    type = [ProductType.ECOMMERCE]
  ) {
    if (req.session.authUser && req.session.authUser!.role === Role.ADMIN) {
      type = Object.values(ProductType)
    }
    return CategoryService.getAllCategories(withNoProducts, type)
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

  @Mutation(() => Category)
  @Authorized(Role.ADMIN)
  public EditTypeForCategory(
    @Arg('id', () => ID) categoryId: Category['id'],
    @Arg('type', () => [ProductType]) types: ProductType[],
    @Arg('applyToSubs', () => Boolean, { defaultValue: false })
    applyToSubs: boolean
  ) {
    return CategoryService.editTypeForCategory(categoryId, types, applyToSubs)
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
  public async subCategories(
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts: Boolean = false,
    @Arg('allTypes', () => Boolean, {
      nullable: true,
      defaultValue: false,
    })
    allTypes: boolean,
    @Root() root: Category
  ) {
    const { subCategories } = (await Category.findOne(root.id, {
      relations: ['subCategories'],
    })) as Category
    if (withNoProducts && allTypes) return subCategories
    if (withNoProducts)
      return subCategories.filter(filterByType([ProductType.ECOMMERCE]))
    const categoriesWithSubProducts = (await Promise.all(
      subCategories.map(async (sub) => {
        return {
          ...sub,
          products: await CategoryService.getProducts(sub.id),
        }
      })
    )) as Category[]
    const filtered = categoriesWithSubProducts.filter(
      (sub) => sub.products.length > 0
    )
    if (allTypes) return filtered
    return filtered.filter(filterByType([ProductType.ECOMMERCE]))
  }

  @FieldResolver(() => ProductPaginationConnection)
  public products(@Args() { limit, page }: SearchArgs, @Root() root: Category) {
    return CategoryService.getProducts(root.id, limit, page)
  }

  @FieldResolver(() => ProductPaginationConnection)
  public productsConnection(
    @Args() { limit, page }: SearchArgs,
    @Root() root: Category
  ) {
    return CategoryService.getProductsPaginated(root.id, limit, page)
  }
}
