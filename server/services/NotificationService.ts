import { In, SelectQueryBuilder } from 'typeorm'
import { User } from '../models/User'
import { Notification } from '../models/notification/Notification'

export class NotificationService {
  public static getNotifications(userId: User['id']) {
    return Notification.find({
      join: {
        alias: 'notification',
        leftJoinAndSelect: {
          user: 'notification.user',
        },
      },
      where: (qb: SelectQueryBuilder<Notification>) => {
        qb.where('notification.user = :userId', {
          userId,
        }).andWhere('notification.read = false')
      },
    })
  }

  public static async getAllNotifications(userId: User['id']) {
    const user = await User.findOne(userId, { relations: ['notifications'] })
    if (!user) throw new Error('User not found')
    return user.notifications
  }

  public static async read(
    userId: User['id'],
    notificationId: Notification['id']
  ) {
    const notification = await Notification.findOne({
      join: {
        alias: 'notification',
        leftJoinAndSelect: {
          user: 'notification.user',
        },
      },
      where: (qb: SelectQueryBuilder<Notification>) => {
        qb.where({
          id: notificationId,
        }).andWhere('notification.user = :userId', { userId })
      },
    })
    if (!notification) throw new Error('Notification not found')
    await Notification.update(
      {
        id: notificationId,
      },
      {
        read: true,
      }
    )
    return true
  }

  public static async readAll(userId: User['id']) {
    const notifications = await Notification.find({
      join: {
        alias: 'notification',
        leftJoinAndSelect: {
          user: 'notification.user',
        },
      },
      where: (qb: SelectQueryBuilder<Notification>) => {
        qb.where('notification.user = :userId', {
          userId,
        }).andWhere('notification.read is not true')
      },
    })
    await Notification.update(
      {
        id: In(notifications.map((notification) => notification.id)),
      },
      {
        read: true,
      }
    )
    return true
  }
}
