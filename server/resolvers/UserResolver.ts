import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import { User } from '../models/User'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { Role } from '../enums/Role'
import { UserService } from '../services/UserService'
import { UpdateUserInfoInput } from '../inputs/UpdateUserInfoInput'
import { Address } from '../models/Address'
import { Purchase } from '../models/Purchase'

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  @Authorized(Role.USER, Role.OPERATOR)
  public GetActualUser(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return User.findOne(id)
  }

  @Query(() => [User])
  @Authorized(Role.ADMIN, Role.OPERATOR)
  public GetUsers() {
    return UserService.getAll()
  }

  @Query(() => [User])
  @Authorized(Role.OPERATOR)
  public FindUsers(@Arg('name', () => String) name: string) {
    return UserService.findUser(name)
  }

  @Mutation(() => User)
  @Authorized(Role.USER, Role.OPERATOR)
  public UpdateTheme(
    @Arg('isDark', () => Boolean) isDark: boolean,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    req.session.authUser!.darkTheme = isDark
    return UserService.updateTheme(id, isDark)
  }

  @Mutation(() => User)
  @Authorized(Role.USER)
  public UpdateUserInfo(
    @Arg('user', () => UpdateUserInfoInput) user: UpdateUserInfoInput,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return UserService.updateUserInfo(id, user)
  }

  @Mutation(() => User)
  @Authorized(Role.USER)
  public ResetPassword(
    @Arg('newPassword', () => String) newPassword: string,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return UserService.resetPassword(id, newPassword)
  }

  @FieldResolver(() => [Address])
  public async addresses(@Root() root: User) {
    const { addresses } = (await User.findOne(root.id, {
      relations: ['addresses'],
    })) as User
    return addresses
  }

  @FieldResolver(() => [Address])
  public async phones(@Root() root: User) {
    const { phones } = (await User.findOne(root.id, {
      relations: ['phones'],
    })) as User
    return phones
  }

  @FieldResolver(() => [Purchase])
  public async purchases(@Root() root: User) {
    const { purchases } = (await User.findOne(root.id, {
      relations: ['purchases'],
    })) as User
    return purchases
  }
}
