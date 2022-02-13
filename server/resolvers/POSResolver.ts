import {
  Resolver,
  Query,
  Authorized,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  ID,
} from 'type-graphql'
import { POS } from '../models/POS'
import { POSService } from '../services/POSService'
import { Role } from '../enums/Role'
import { CreatePOSInput } from '../inputs/CreatePOSInput'

@Resolver(() => POS)
export class POSResolver {
  @Query(() => [POS])
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetPOS() {
    return POSService.getAll()
  }

  @Query(() => POS, { nullable: true })
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetOnePOS(@Arg('id', () => ID) id: POS['id']) {
    return POSService.getOnePOS(id)
  }

  @Query(() => POS, { nullable: true })
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetPOSByHostname(@Arg('hostname', () => String) hostname: string) {
    return POSService.getByHostname(hostname)
  }

  @Query(() => [POS])
  @Authorized(Role.ADMIN, Role.OPERATOR)
  public GetAvailablePOS() {
    return POSService.getAvailablePOS()
  }

  @Mutation(() => POS)
  @Authorized(Role.ADMIN)
  public CreatePOS(@Arg('pos', () => CreatePOSInput) pos: CreatePOSInput) {
    return POSService.create(pos)
  }

  @Mutation(() => POS)
  @Authorized(Role.ADMIN, Role.OPERATOR)
  public ConfigurePOS(
    @Arg('id', () => ID) id: POS['id'],
    @Arg('hostname', () => String) hostname: string
  ) {
    return POSService.configure(id, hostname)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public RemovePOS(@Arg('id', () => ID) id: POS['id']) {
    return POSService.remove(id)
  }

  @FieldResolver()
  public async printers(@Root() root: POS) {
    const { printers } = (await POS.findOne(root.id, {
      relations: ['printers'],
    })) as POS
    return printers
  }
}
