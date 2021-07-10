import { User } from '../models/User'

export class UserService {
  public static getOne(id: User['id']) {
    return User.findOne(id)
  }

  public static getAll() {
    return User.find()
  }

  public static async updateTheme(id: User['id'], isDark: boolean) {
    const user = await User.findOne(id)
    if (!user) throw new Error('User not found')
    user.darkTheme = isDark
    return user.save()
  }
}
