import { Arg, Mutation, Resolver, Ctx, Authorized } from 'type-graphql'

import { User } from '../models/User'
import { AuthService } from '../services/AuthService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  public async Login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { req }: CustomExpressContext
  ) {
    const user = await AuthService.login(username, password)
    req.session.authUser = user
    return user
  }

  @Mutation(() => Boolean)
  @Authorized()
  public Logout(@Ctx() { req }: CustomExpressContext) {
    delete req.session.authUser
    return true
  }
}
