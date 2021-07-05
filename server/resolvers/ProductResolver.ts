import { Arg, Mutation, Query, Resolver, ID } from 'type-graphql'

import { CreateProductInput } from '../../inputs/CreateProductInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { ProductService } from '../services/ProductService'

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  public GetProducts() {
    return ProductService.getProducts()
  }

  @Query(() => Product)
  GetProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.getProduct(id)
  }

  @Query(() => [Product])
  public GetProductsForCategory(
    @Arg('name', () => String) name: Category['name']
  ) {
    return ProductService.getProductsForCategory(name)
  }

  @Query(() => [Product])
  public GetInactivatedProducts() {
    return ProductService.getInactivatedProducts()
  }

  @Mutation(() => Product)
  public CreateProduct(
    @Arg('product', () => CreateProductInput) product: CreateProductInput
  ) {
    return ProductService.createProduct(product)
  }

  @Mutation(() => Boolean)
  public InactivateProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.inactivate(id)
  }

  @Mutation(() => Boolean)
  public InactivateProducts(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.inactivateMany(ids)
  }

  @Mutation(() => Boolean)
  public ReactivateProduct(@Arg('id', () => ID) id: Product['id']) {
    return ProductService.reactivate(id)
  }

  @Mutation(() => Boolean)
  public ReactivateProducts(@Arg('ids', () => [ID]) ids: Product['id'][]) {
    return ProductService.reactivateMany(ids)
  }
}
