import sanitize from 'sanitize-html'
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

import { Role } from '../enums/Role'
import { CreateProductInput } from '../inputs/CreateProductInput'
import { EditProductInput } from '../inputs/EditProductInput'
import { SearchProductInput } from '../inputs/SearchProductInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { ProductService } from '../services/ProductService'
import { DeletedProductResult } from '../types/DeletedProductResult'

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  public GetProducts() {
    return ProductService.getProducts()
  }

  @Query(() => [Product])
  public GetProductsByIds(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.getProductsByIds(ids)
  }

  @Query(() => Product, { nullable: true })
  GetProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.getProduct(id)
  }

  @Query(() => [Product])
  SearchProducts(
    @Arg('search', () => SearchProductInput) search: SearchProductInput
  ) {
    return ProductService.searchProduct(search)
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
    @Arg('product', () => CreateProductInput) product: CreateProductInput
  ) {
    return ProductService.createProduct(product)
  }

  @Mutation(() => Product)
  @Authorized(Role.ADMIN)
  public EditProduct(
    @Arg('id', () => ID) id: Product['id'],
    @Arg('product', () => EditProductInput) product: EditProductInput
  ) {
    return ProductService.editProduct(id, product)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public InactivateProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.inactivate(id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public InactivateProducts(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.inactivateMany(ids)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public ReactivateProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.reactivate(id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public ReactivateProducts(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.reactivateMany(ids)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public RemoveImage(
    @Arg('product', () => ID) product: Product['id'],
    @Arg('image', () => String) image: string
  ) {
    return ProductService.removeImage(product, image)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public DeleteProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.deleteProduct(id)
  }

  @Mutation(() => [DeletedProductResult])
  @Authorized(Role.ADMIN)
  public DeleteProducts(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.deleteProducts(ids)
  }

  @Mutation(() => [ID])
  @Authorized(Role.ADMIN)
  public UpdateCategoryForProducts(
    @Arg('products', () => [ID]) products: Product['id'][],
    @Arg('category', () => ID) category: Category['id']
  ) {
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
}
