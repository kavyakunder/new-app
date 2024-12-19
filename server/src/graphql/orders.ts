export const getOrders = (): string => {
    return `
            query($limit: Int, $offset: Int, $sort: [String!]) {
              orders(limit: $limit, offset: $offset, sort: $sort){
                total
                results {
                  id
                  customerId
                  cart{
                  id
                  }
                  customer {
                    id
                    customerNumber
                    email
                    firstName
                    lastName
                  }
                  customerEmail
                  anonymousId
                  lineItems {
                    id
                    key
                    productId
                    productKey
                    name(locale: "en")
                    productSlug(locale: "en")
                    price {
                      id
                      value {
                        currencyCode
                        centAmount
                        fractionDigits
                      }
                    }
                    custom {
                      customFieldsRaw {
                        name
                        value
                      }
                    }
                    priceMode
                    quantity
                    price {
                      id
                      value {
                        currencyCode
                        centAmount
                        fractionDigits
                      }
                      key
                      country
                      custom {
                        customFieldsRaw {
                          name
                          value
                        }
                      }
                    }
                    taxedPrice {
                      totalTax {
                        currencyCode
                        centAmount
                        fractionDigits
                      }
                    }
                    totalPrice {
                      currencyCode
                      centAmount
                      fractionDigits
                    }
                  }
                  customLineItems {
                    id
                    name
                    key
                    money {
                      currencyCode
                      centAmount
                      fractionDigits
                    }
                    slug
                    totalPrice {
                      currencyCode
                      centAmount
                      fractionDigits
                    }
                    quantity
                  }
                  totalPrice {
                    type
                    currencyCode
                    centAmount
                    fractionDigits
                  }
                  taxedPrice {
                    totalTax {
                      currencyCode
                      centAmount
                      fractionDigits
                    }
                  }
                  discountOnTotalPrice {
                    discountedAmount {
                      currencyCode
                      centAmount
                      fractionDigits
                    }
                  }
                  shippingAddress {
                    id
                    streetName
                    streetNumber
                    postalCode
                    city
                    region
                    state
                    country
                    phone
                    mobile
                    phone
                    custom {
                      customFieldsRaw {
                        name
                        value
                      }
                    }
                  }
                  billingAddress {
                    id
                    streetName
                    streetNumber
                    postalCode
                    city
                    region
                    state
                    country
                    mobile
                    phone
                    custom {
                      customFieldsRaw {
                        name
                        value
                      }
                    }
                  }
                  inventoryMode
                  taxMode
                  taxRoundingMode
                  taxCalculationMode
                  country
                  shippingKey
                  shippingInfo {
                    shippingMethodName
                    shippingMethodState
                    shippingRate {
                      price {
                        currencyCode
                        centAmount
                        fractionDigits
                      }
                    }
                    deliveries {
                      id
                      key
                      items {
                        id
                        quantity
                      }
                      parcels {
                        id
                        key
                        measurements {
                          heightInMillimeter
                          lengthInMillimeter
                          widthInMillimeter
                          weightInGram
                        }
                        trackingData {
                          trackingId
                          carrier
                          provider
                          providerTransaction
                          isReturn
                        }
                        items {
                          id
                          quantity
                        }
                        custom {
                          customFieldsRaw {
                            name
                            value
                          }
                        }
                      }
                      custom {
                        customFieldsRaw {
                          name
                          value
                        }
                      }
                    }
                  }
                  discountCodes {
                    state
                    discountCode {
                      code
                      isActive
                      key
                    }
                  }
                  directDiscounts {
                    id
                  }
                  refusedGifts {
                    id
                  }
                  paymentInfo {
                    payments {
                      id
                      key
                      customer {
                        email
                        customerNumber
                        firstName
                        lastName
                      }
                      amountPlanned {
                        currencyCode
                        centAmount
                        fractionDigits
                      }
                      paymentMethodInfo {
                        paymentInterface
                        method
                        name(locale: "en")
                      }
                      paymentStatus {
                        interfaceCode
                        interfaceText
                      }
                      custom {
                        customFieldsRaw {
                          name
                          value
                        }
                      }
                      transactions {
                        id
                        timestamp
                        amount {
                          centAmount
                          centAmount
                          fractionDigits
                        }
                        interactionId
                        custom {
                          customFieldsRaw {
                            name
                            value
                          }
                        }
                      }
                      interfaceInteractionsRaw {
                        results {
                          fields {
                            name
                            value
                          }
                        }
                      }
                    }
                  }
                  locale
                  origin
                  version
                  custom {
                    customFieldsRaw {
                      name
                      value
                    }
                  }
                  purchaseOrderNumber
                  returnInfo {
                    returnTrackingId
                    returnDate
                  }
                  paymentState
                  shipmentState
                  orderState
                  orderNumber
                  shippingMode
                  taxedShippingPrice {
                    totalTax {
                      centAmount
                      centAmount
                      fractionDigits
                    }
                  }
                }
              }
            }

`;
}
