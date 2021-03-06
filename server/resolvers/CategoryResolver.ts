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
  Int,
} from 'type-graphql'

import { SearchArgs } from '../args/SearchArgs'
import { Role } from '../enums/Role'
import { CreateCategoryInput } from '../inputs/CreateCategoryInput'
import { EditCategoryInput } from '../inputs/EditCategoryInput'
import { Category } from '../models/Category'
import { CategoryService, filterByType } from '../services/CategoryService'
import { ProductType } from '../enums/ProductType'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { ProductPaginationConnection } from '../types/pagination/product/ProductPagination'
import { CategoryPagination } from '../types/pagination/category/CategoryPagination'

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => CategoryPagination)
  public GetCategories(
    @Ctx() { req }: CustomExpressContext,
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean,
    @Arg('type', () => [ProductType], { nullable: true })
    type = [ProductType.ECOMMERCE],
    @Arg('page', () => Int, { nullable: true, defaultValue: 1 }) page?: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 })
    limit?: number
  ): Promise<CategoryPagination> {
    if (req.session.authUser && req.session.authUser!.role === Role.ADMIN) {
      type = Object.values(ProductType)
    }
    return CategoryService.getRootCategories(withNoProducts, type, page, limit)
  }

  @Query(() => CategoryPagination)
  public GetAllCategories(
    @Ctx() { req }: CustomExpressContext,
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts?: boolean,
    @Arg('type', () => [ProductType], { nullable: true })
    type = [ProductType.ECOMMERCE],
    @Arg('page', () => Int, { nullable: true, defaultValue: 1 }) page?: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 })
    limit?: number
  ) {
    if (req.session.authUser && req.session.authUser!.role === Role.ADMIN) {
      type = Object.values(ProductType)
    }
    return CategoryService.getAllCategories(withNoProducts, type, page, limit)
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

  @FieldResolver(() => CategoryPagination)
  public async subCategories(
    @Arg('withNoProducts', () => Boolean, { nullable: true })
    withNoProducts: Boolean = false,
    @Arg('allTypes', () => Boolean, {
      nullable: true,
      defaultValue: false,
    })
    allTypes: boolean,
    @Root() root: Category,
    @Arg('page', () => Int, { nullable: true, defaultValue: 1 })
    page: number = 1,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 })
    limit: number = 10
  ): Promise<CategoryPagination> {
    // FIXME
    const [subCategories, total] = await Category.findAndCount({
      where: {
        father: root.id,
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    const pages = Math.round(total / limit)

    return {
      total,
      pageInfo: {
        page,
        pages,
        endCursor:
          subCategories.length > 0
            ? subCategories[subCategories.length - 1].id
            : '',
        hasNextPage: page < pages,
      },
      edges: subCategories.map((category) => ({
        cursor: category.id,
        node: category,
      })),
    }
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
