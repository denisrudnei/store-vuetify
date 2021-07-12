import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../models/User'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { Role } from '../enums/Role'
import { UserService } from '../services/UserService'

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  @Authorized()
  public GetActualUser(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return User.findOne(id)
  }

  @Query(() => [User])
  @Authorized(Role.ADMIN)
  public GetUsers() {
    return UserService.getAll()
  }

  @Mutation(() => User)
  @Authorized(Role.USER)
  public UpdateTheme(
    @Arg('isDark', () => Boolean) isDark: boolean,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    req.session.authUser!.darkTheme = isDark
    return UserService.updateTheme(id, isDark)
  }
}
