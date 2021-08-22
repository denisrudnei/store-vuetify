import ggl from 'graphql-tag'

import { purchaseFragment } from './purchaseFragment'

export const GetPurchases = ggl`
query {
  GetPurchases {
    ...purchaseFragment
  }
}
${purchaseFragment}
`
