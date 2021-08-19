import { registerEnumType } from 'type-graphql'

export enum SummaryEvents {
  UPDATE_SUMMARY = 'UPDATE_SUMMARY',
}

registerEnumType(SummaryEvents, {
  name: 'SummaryEvents',
})
