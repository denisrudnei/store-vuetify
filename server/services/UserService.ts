import { User } from '../models/User'
import { UpdateUserInfoInput } from '../inputs/UpdteUserInfoInput'

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

  public static async updateUserInfo(
    id: User['id'],
    userToUpdate: UpdateUserInfoInput
  ) {
    const user = await User.findOne(id)
    if (!user) throw new Error('User not found')
    Object.assign(user, userToUpdate)
    return user.save()
  }

  public static async resetPassword(id: User['id'], newPassword: string) {
    const user = await User.findOne(id)
    if (!user) throw new Error('User not found')
    user.password = newPassword
    return user.save()
  }
}
