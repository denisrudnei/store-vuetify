import braintree, { BraintreeGateway, Environment } from 'braintree'

import { Purchase } from '../models/Purchase'

export class GatewayService {
  public static gateway?: braintree.BraintreeGateway

  public static init() {
    this.gateway = new BraintreeGateway({
      environment: Environment.Sandbox,
      merchantId: process.env.MERCHANT_ID!,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
    })
  }

  public static async getToken() {
    const response = await this.gateway?.clientToken.generate({})
    return response?.clientToken
  }

  public static async makeSale(
    purchase: Purchase,
    nonce: string,
    deviceData: string
  ) {
    const saleRequest = {
      amount: (await purchase.totalPrice()).toFixed(2),
      paymentMethodNonce: nonce,
      deviceData,
      options: {
        submitForSettlement: true,
      },
    }
    return this.gateway?.transaction.sale(saleRequest)
  }
}
