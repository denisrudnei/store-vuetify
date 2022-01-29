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

  @Query(() => POS)
  @Authorized(Role.OPERATOR, Role.ADMIN)
  public GetOnePOS(@Arg('id', () => ID) id: POS['id']) {
    return POSService.getOnePOS(id)
  }

  @Mutation(() => POS)
  @Authorized(Role.ADMIN)
  public CreatePOS(@Arg('pos', () => CreatePOSInput) pos: CreatePOSInput) {
    return POSService.create(pos)
  }

  @FieldResolver()
  public async printers(@Root() root: POS) {
    const { printers } = (await POS.findOne(root.id, {
      relations: ['printers'],
    })) as POS
    return printers
  }
}
