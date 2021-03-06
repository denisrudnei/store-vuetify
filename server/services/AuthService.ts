import { Like } from 'typeorm'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

export type UserRegister = {
  email: string
  name: string
  password: string
}

export class AuthService {
  public static async register(userToRegister: UserRegister) {
    const userInbDb = await User.findOne({
      where: {
        email: Like(userToRegister.email),
      },
    })
    if (userInbDb) throw new Error('User already registered')
    const user = User.create()
    user.name = userToRegister.name
    user.email = userToRegister.email
    user.password = userToRegister.password
    return user.save()
  }

  public static async login(email: string, password: string) {
    const user = await User.findOne({
      where: {
        email: Like(email),
      },
    })
    if (!user) throw new Error('Login failed')
    if (!user.active) throw new Error('Not active')
    const logged = bcrypt.compareSync(password, user.password)
    if (logged) return user
    throw new Error('Incorrect password')
  }

  public static generateToken(user: User) {
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        darkTheme: user.darkTheme,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: '30m',
      }
    )
    return token
  }
}
