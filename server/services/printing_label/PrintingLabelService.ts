import { Label } from '../../models/printing_label/Label'
import { CreateLabelInput } from '../../inputs/printing_label/CreateLabelInput'
import { BarcodeLabelItem } from '../../models/printing_label/items/BarcodeLabelItem'
import { OriginPoint } from '../../models/printing_label/OriginPoint'
import { CreateBarcodeItemInput } from '../../inputs/printing_label/CreateBarcodeItemInput'
import { LabelItem } from '../../models/printing_label/items/LabelItem'

export class PrintingLabelService {
  public static getAll() {
    return Label.find()
  }

  public static async getOne(id: Label['id']) {
    const label = await Label.findOne(id)
    if (!label) throw new Error('Label not found')
    return label
  }

  public static create(newLabel: CreateLabelInput) {
    const label = Label.create()

    label.name = newLabel.name
    label.width = newLabel.width
    label.height = newLabel.height
    label.numberOfLabels = newLabel.numberOfLabels

    return label.save()
  }

  public static async remove(id: Label['id']) {
    const label = await Label.findOne({
      where: {
        id,
      },
      relations: ['items'],
    })

    if (!label) throw new Error('Label not found')
    const items = await LabelItem.findByIds(label.items.map((item) => item.id))
    await Promise.all(items.map((item) => item.remove()))
    await label.remove()
  }

  public static async addBarcodeItem(
    labelId: Label['id'],
    barcodeItem: CreateBarcodeItemInput
  ) {
    const label = await Label.findOne(labelId, { relations: ['items'] })
    if (!label) throw new Error('Label not found')
    const item = BarcodeLabelItem.create()
    const origin = OriginPoint.create()

    item.name = barcodeItem.name

    origin.x = barcodeItem.origin.x
    origin.y = barcodeItem.origin.y

    item.origin = await origin.save()

    item.showNumbers = barcodeItem.showNumbers
    item.label = label

    await item.save()

    label.items.push(item)

    await label.save()

    return item
  }

  public static async removeLabelItem(itemId: LabelItem['id']) {
    const item = await LabelItem.findOne(itemId)
    if (!item) throw new Error('Label item not found')
    await item.remove()
  }
}
