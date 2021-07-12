import { AuthChecker } from 'type-graphql'
import jwt from 'jsonwebtoken'
import { CustomExpressContext } from './types/CustomExpressContext'
import { User } from './models/User'
import { Role } from './enums/Role'

export const CustomAuthChecker: AuthChecker<CustomExpressContext> = async (
  { root, args, context, info },
  roles
) => {
  const { req } = context
  const { session } = req
  if (!req.headers.authorization && !req.session!.authUser) return false
  if (session && session.authUser) return roles.includes(session.authUser.role)
  const items = req.headers.authorization!.split(' ')
  const token = items[items.length - 1]

  const data = jwt.decode(token)

  req.session.authUser = data as User

  const user = await User.findOne((data as User).id)
  if (!user) return false
  if (user.role === Role.ADMIN) return true
  return roles.includes(user.role)
}

export default CustomAuthChecker
