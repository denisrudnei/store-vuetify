import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'

import { NotificationEvents } from '../enums/NotificationEvents'
import { Role } from '../enums/Role'
import { Notification } from '../models/notification/Notification'
import { NotificationService } from '../services/NotificationService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver(() => Notification)
export class NotificationResolver {
  @Query(() => [Notification])
  @Authorized(Role.USER, Role.OPERATOR)
  public GetNotifications(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return NotificationService.getNotifications(id)
  }

  @Query(() => [Notification])
  @Authorized(Role.USER, Role.OPERATOR)
  public GetAllNotifications(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return NotificationService.getAllNotifications(id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER, Role.OPERATOR)
  public ReadNotification(
    @Arg('id', () => ID) notificationId: Notification['id'],
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return NotificationService.read(id, notificationId)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER, Role.OPERATOR)
  public ReadAllNotifications(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return NotificationService.readAll(id)
  }

  @Subscription(() => Notification, {
    topics: NotificationEvents.NEW_NOTIFICATION,
    filter: ({ context, payload }) => {
      if (!context.req || !context.req.authUser) return false
      return context.req.authUser.id === payload.user.id
    },
  })
  public NewNotification(@Root() payload: Notification) {
    return payload
  }
}
