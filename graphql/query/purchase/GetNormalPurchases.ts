import ggl from 'graphql-tag'

import { purchaseFragment } from './purchaseFragment'

export const GetNormalPurchases = ggl`
query  {
  GetNormalPurchases {
    ...purchaseFragment
  }
}
${purchaseFragment}
`
