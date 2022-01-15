import { registerEnumType } from 'type-graphql'

export enum LabelFontSize {
  one = 1,
  two = 2,
  tree = 3,
  four = 4,
  five = 5,
}

registerEnumType(LabelFontSize, {
  name: 'LabelFontSize',
})
