import sanitize from 'sanitize-html'
import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Int,
  Subscription,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { CreateProductInput } from '../inputs/CreateProductInput'
import { EditProductInput } from '../inputs/EditProductInput'
import { SearchProductInput } from '../inputs/SearchProductInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { ProductService } from '../services/ProductService'
import { DeletedProductResult } from '../types/DeletedProductResult'
import { SummaryEvents } from '../enums/SummaryEvents'
import { ProductPaginationConnection } from '../types/ProductPagination'
import { ProductEvents } from '../enums/ProductEvents'
import { ProductType } from '../enums/ProductType'

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  public GetProducts() {
    return ProductService.getProducts()
  }

  @Query(() => ProductPaginationConnection)
  public GetProductsPaginated(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number = 1,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number = 10
  ) {
    return ProductService.getProductsPaginated(page, limit)
  }

  @Query(() => [Product])
  public GetProductsByIds(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.getProductsByIds(ids)
  }

  @Query(() => [String])
  public GetProductTypes() {
    return Object.values(ProductType)
  }

  @Query(() => Product, { nullable: true })
  GetProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.getProduct(id)
  }

  @Query(() => ProductPaginationConnection)
  SearchProducts(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number = 1,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number = 10,
    @Arg('search', () => SearchProductInput) search: SearchProductInput
  ) {
    return ProductService.searchProduct(search, page, limit)
  }

  @Query(() => [Product])
  public GetProductsForCategory(
    @Arg('name', () => String) name: Category['name']
  ) {
    return ProductService.getProductsForCategory(name)
  }

  @Query(() => [Product])
  @Authorized(Role.ADMIN)
  public GetInactivatedProducts() {
    return ProductService.getInactivatedProducts()
  }

  @Mutation(() => Product)
  @Authorized(Role.ADMIN)
  public CreateProduct(
    @Arg('product', () => CreateProductInput) product: CreateProductInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const newProduct = ProductService.createProduct(product)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, newProduct)
    return newProduct
  }

  @Mutation(() => Product)
  @Authorized(Role.ADMIN)
  public async EditProduct(
    @Arg('id', () => ID) id: Product['id'],
    @Arg('product', () => EditProductInput) product: EditProductInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const newProduct = await ProductService.editProduct(id, product)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, newProduct)
    return newProduct
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public InactivateProduct(
    @Arg('id', () => ID) id: Product['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    const inactivated = ProductService.inactivate(id)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return inactivated
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public InactivateProducts(
    @Arg('ids', () => [ID]) ids: Product['id'][],
    @PubSub() pubSub: PubSubEngine
  ) {
    const inactivated = ProductService.inactivateMany(ids)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return inactivated
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public ReactivateProduct(
    @Arg('id', () => ID) id: Product['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    const reactivated = ProductService.reactivate(id)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return reactivated
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public ReactivateProducts(
    @Arg('ids', () => [ID]) ids: Product['id'][],
    @PubSub() pubSub: PubSubEngine
  ) {
    const reactivated = ProductService.reactivateMany(ids)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return reactivated
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public RemoveImage(
    @Arg('product', () => ID) product: Product['id'],
    @Arg('image', () => String) image: string,
    @PubSub() pubSub: PubSubEngine
  ) {
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return ProductService.removeImage(product, image)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public DeleteProduct(
    @Arg('id', () => ID) id: Product['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return ProductService.deleteProduct(id)
  }

  @Mutation(() => [DeletedProductResult])
  @Authorized(Role.ADMIN)
  public DeleteProducts(
    @Arg('ids', () => [ID]) ids: Product['id'][],
    @PubSub() pubSub: PubSubEngine
  ) {
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return ProductService.deleteProducts(ids)
  }

  @Mutation(() => [ID])
  @Authorized(Role.ADMIN)
  public UpdateCategoryForProducts(
    @Arg('products', () => [ID]) products: Product['id'][],
    @Arg('category', () => ID) category: Category['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    pubSub.publish(ProductEvents.PRODUCT_UPDATED, null)
    return ProductService.updateCategoryForProducts(products, category)
  }

  @FieldResolver()
  public async category(@Root() root: Product) {
    const { category } = (await Product.findOne(root.id, {
      relations: ['category'],
    })) as Product
    return category
  }

  @FieldResolver(() => String)
  public ogDescription(@Root() root: Product) {
    return `${sanitize(root.description, {
      allowedTags: ['br'],
    })
      .replace('<br />', '\n')
      .slice(0, 157)}...`
  }

  @Subscription(() => Product, {
    nullable: true,
    topics: ProductEvents.PRODUCT_UPDATED,
  })
  public ProductUpdated(@Root() root: Product) {
    return root
  }
}
