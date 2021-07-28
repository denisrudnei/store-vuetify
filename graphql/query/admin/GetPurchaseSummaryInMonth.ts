import ggl from 'graphql-tag'

export const GetPurchaseSummaryInMonth = ggl`
query GetPurchaseSummaryInMonth ($year: Int!, $month: Int!) {
  GetPurchaseSummaryInMonth (year: $year, month: $month) {
    day
    total
  }
}
`
