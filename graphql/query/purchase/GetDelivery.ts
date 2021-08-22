import ggl from 'graphql-tag'

import { purchaseFragment } from './purchaseFragment'

export const GetDelivery = ggl`
query  {
  GetDelivery {
    ...purchaseFragment
  }
}
${purchaseFragment}
`
