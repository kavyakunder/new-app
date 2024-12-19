export const getCustomers = (): string => {
    return`query($limit: Int, $offset: Int, $sort: [String!]) {
                customers(limit: $limit, offset: $offset, sort: $sort) {
                    total
                    results {
                    id
                    customerNumber
                    email
                    addresses {
                        id
                        streetName
                        streetNumber
                        additionalStreetInfo
                        postalCode
                        city
                        region
                        state
                        country
                        key
                        phone
                        mobile
                        salutation
                        firstName
                        lastName
                        custom {
                        customFieldsRaw {
                            name
                            value
                        }
                        }
                    }
                    defaultShippingAddressId
                    defaultBillingAddressId
                    shippingAddressIds
                    billingAddressIds
                    isEmailVerified
                    externalId
                    key
                    authenticationMode
                    firstName
                    lastName
                    middleName
                    title
                    locale
                    salutation
                    dateOfBirth
                    companyName
                    password
                    customerGroup {
                        id
                        name
                        key
                        version
                        custom {
                        customFieldsRaw {
                            name
                            value
                        }
                        }
                    }
                    defaultShippingAddress {
                        id
                        postalCode
                        city
                        state
                        region
                        country
                        custom {
                        customFieldsRaw {
                            name
                            value
                        }
                        }
                    }
                    defaultBillingAddress {
                        id
                        streetName
                        state
                        city
                        region
                        country
                        custom {
                        customFieldsRaw {
                            name
                            value
                        }
                        }
                    }
                    stores {
                        id
                        version
                        key
                        name
                        languages
                        countries {
                        code
                        }
                        countries {
                        code
                        }
                        custom {
                        customFieldsRaw {
                            name
                            value
                        }
                        }
                        productSelections {
                        productSelection {
                            name
                            productCount
                            id
                            mode
                            key
                            custom {
                            customFieldsRaw {
                                name
                                value
                            }
                            }
                            version
                        }
                        active
                        }
                        distributionChannels {
                        id
                        version
                        key
                        roles
                        name
                        description
                        geoLocation {
                            type
                        }
                        }
                        supplyChannels {
                        id
                        version
                        key
                        roles
                        name
                        description
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
                        id
                        version
                        createdAt
                        lastModifiedAt
                        }
                    }
                }
            }
            `
}