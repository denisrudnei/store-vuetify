import { Resolver, FieldResolver, Root } from 'type-graphql'

import { LabelItem } from '../../models/printing_label/items/LabelItem'

@Resolver(() => LabelItem)
export class LabelItemResolver {
  @FieldResolver()
  public async origin(@Root() root: LabelItem) {
    const { origin } = (await LabelItem.findOne(root.id, {
      relations: ['origin'],
    })) as LabelItem
    return origin
  }
}
