import { Resolver, Root, Subscription } from 'type-graphql'
import { ImportEvents } from '../enums/ImportEvent'

@Resolver()
export class ImportResolver {
  @Subscription(() => String, {
    topics: ImportEvents.productImported,
  })
  public ProductImported(@Root() payload: String) {
    return payload
  }
}
