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
      // @ts-ignore
      where: (qb: SelectQueryBuilder<Notification>) => {
        qb.where('notification.user = :userId', {
          id: userId,
        }).andWhere('notification.read = false')
      },
      order: {
        date: 'DESC',
      },
    })
  }

  public static getAllNotifications(userId: User['id']) {
    return Notification.find({
      join: {
        alias: 'notification',
        leftJoinAndSelect: {
          user: 'notification.user',
        },
      },
      // @ts-ignore
      where: (qb: SelectQueryBuilder<Notification>) => {
        qb.where('notification.user = :userId', {
          userId,
        })
      },
      order: {
        date: 'DESC',
      },
    })
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
      // @ts-ignore
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
      // @ts-ignore
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
