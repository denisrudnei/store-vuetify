import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql'

import { CreateProductInput } from '../../inputs/CreateProductInput'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { ProductService } from '../services/ProductService'
import { EditProductInput } from '../../inputs/EditProductInput'

@Resolver(() => Product)
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

  @Mutation(() => Product)
  public EditProduct(
    @Arg('id', () => ID) id: Product['id'],
    @Arg('product', () => EditProductInput) product: EditProductInput
  ) {
    return ProductService.editProduct(id, product)
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

  @FieldResolver()
  public async category(@Root() root: Product) {
    const { category } = (await Product.findOne(root.id, {
      relations: ['category'],
    })) as Product
    return category
  }
}
