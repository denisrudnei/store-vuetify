import { registerEnumType } from 'type-graphql'

export enum LabelItemRotation {
  normal = 0,
  toRight90degrees = 1,
  toRight180degrees = 2,
  toRight270degrees = 3,
}

registerEnumType(LabelItemRotation, {
  name: 'LabelItemRotation',
})
