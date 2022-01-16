import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql'
import { Label } from '../../models/printing_label/Label'
import { PrintingLabelService } from '../../services/printing_label/PrintingLabelService'
import { CreateLabelInput } from '../../inputs/printing_label/CreateLabelInput'
import { BarcodeLabelItem } from '../../models/printing_label/items/BarcodeLabelItem'
import { CreateBarcodeItemInput } from '../../inputs/printing_label/CreateBarcodeItemInput'
import { LabelItem } from '../../models/printing_label/items/LabelItem'

@Resolver(() => Label)
export class PrintingLabelResolver {
  @Query(() => [Label])
  public GetLabels() {
    return PrintingLabelService.getAll()
  }

  @Query(() => Label)
  public GetLabel(@Arg('id', () => ID) labelId: Label['id']) {
    return PrintingLabelService.getOne(labelId)
  }

  @Mutation(() => Label)
  public CreateLabel(
    @Arg('label', () => CreateLabelInput) label: CreateLabelInput
  ) {
    return PrintingLabelService.create(label)
  }

  @Mutation(() => Boolean)
  public async RemoveLabel(@Arg('id', () => ID) id: Label['id']) {
    await PrintingLabelService.remove(id)
    return true
  }

  @Mutation(() => Boolean)
  public async RemoveLabelItem(@Arg('id', () => ID) itemId: LabelItem['id']) {
    await PrintingLabelService.removeLabelItem(itemId)
    return true
  }

  @Mutation(() => BarcodeLabelItem)
  public AddBarcodeLabelItem(
    @Arg('label', () => ID) labelId: Label['id'],
    @Arg('item', () => CreateBarcodeItemInput) item: CreateBarcodeItemInput
  ) {
    return PrintingLabelService.addBarcodeItem(labelId, item)
  }

  @FieldResolver()
  public async items(@Root() root: Label) {
    const { items } = (await Label.findOne(root.id, {
      relations: ['items'],
    })) as Label
    return items
  }
}
