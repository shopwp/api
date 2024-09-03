function doGraphQuery(queryData, client) {
  return new Promise(async (resolve, reject) => {
    if (!client) {
      return reject(
        "No Shopify connection found. Please try reconnecting your Shopify store to ShopWP."
      )
    }

    var finalVars = wp.hooks.applyFilters(
      "cart.requestSettings",
      wp.hooks.applyFilters("product.requestSettings", queryData.variables)
    )

    const { data, errors, extensions } = await client.request(queryData.query, {
      variables: finalVars,
    })

    if (errors) {
      reject(errors)
    }

    resolve(data)
  })
}

function makeProductsQuery(queryParams, shopState, customSchema = false) {
  const schema = customSchema
    ? customSchema
    : productsDefaultSchema(queryParams)

  const finalVars = {
    query: queryParams.query,
    first: queryParams.first,
    reverse: queryParams.reverse,
    sortKey: queryParams.sortKey ? queryParams.sortKey : "TITLE",
    language: shopState.language,
    country: queryParams.country,
    buyer: queryParams.buyer,
  }

  if (queryParams.cursor) {
    finalVars.cursor = queryParams.cursor
  }

  return {
    query: `query ProductQuery($query: String!, $first: Int!, $cursor: String, $sortKey: ProductSortKeys, $reverse: Boolean, $language: LanguageCode, $country: CountryCode, $buyer: BuyerInput) @inContext(country: $country, language: $language, buyer: $buyer) {
            products(first: $first, query: $query, after: $cursor, reverse: $reverse, sortKey: $sortKey) {
               pageInfo {
                  hasNextPage
                  hasPreviousPage
               }
               edges {
                  cursor
                  node {
                     ${schema}
                  }
               }
            }
         }`,
    variables: finalVars,
  }
}

function productsDefaultSchema(queryParams = false) {
  if (queryParams.productMetafields && queryParams.productMetafields !== "[]") {
    var productMetafields = atob(queryParams.productMetafields)
  } else {
    var productMetafields = queryParams.productMetafields
  }

  if (
    queryParams.productVariantMetafields &&
    queryParams.productVariantMetafields !== "[]"
  ) {
    var productVariantMetafields = atob(queryParams.productVariantMetafields)
  } else {
    var productVariantMetafields = queryParams.productVariantMetafields
  }

  if (!productMetafields) {
    productMetafields = "[]"
  }

  if (!productVariantMetafields) {
    productVariantMetafields = "[]"
  }

  return `
    availableForSale
    compareAtPriceRange {
      maxVariantPrice {
          amount
          currencyCode
      }
      minVariantPrice {
          amount
          currencyCode
      }
    }
    createdAt
    description
    descriptionHtml
    handle
    id
    onlineStoreUrl
    options {
      id
      name
      values
    }
    metafields(identifiers:${productMetafields}) { 
      type 
      namespace 
      key 
      value
    }
    priceRange {
      maxVariantPrice {
          amount
          currencyCode
      }
      minVariantPrice {
          amount
          currencyCode
      }
    }
    productType
    publishedAt
    requiresSellingPlan
    title
    totalInventory
    updatedAt
    vendor
    tags
    images(first: 250) {
      edges {
          node {
            width
            height
            altText
            id
            originalSrc
            transformedSrc
          }
      }
    },
    media(first: 250) {
      edges {
          node {
            alt
            mediaContentType
            previewImage {
                width
                height
                altText
                id
                url
            }
            ...on ExternalVideo {
                id
                embeddedUrl
            }
            ...on MediaImage {
                image {
                  width
                  height
                  altText
                  id
                  originalSrc
                  transformedSrc                        
                }
            }
            ...on Video {
                sources {
                  url
                  mimeType
                  format
                  height
                  width
                }
            }
          }
      }
    },
    variants(first: 100) {
      edges {
          node {
            product {
                title
                productType
                vendor
                collections(first: 1) {
                  edges {
                      node {
                        title
                      }
                  }
                }
            }
            availableForSale
            compareAtPrice {
                amount
                currencyCode
            }
            currentlyNotInStock
            id
            image {
                width
                height
                altText
                id
                originalSrc
                transformedSrc
            }
            metafields(identifiers:${productVariantMetafields}) { 
              type 
              namespace 
              key 
              value
            }
            price {
                amount
                currencyCode
            }
            quantityAvailable
            requiresShipping
            selectedOptions {
                name 
                value
            }
            sellingPlanAllocations(first: 50) {
                edges {
                  node {
                      sellingPlan {
                        id
                        name
                        priceAdjustments {
                            adjustmentValue {
                              ...on SellingPlanPriceAdjustmentValue {
                                  ...on SellingPlanFixedAmountPriceAdjustment {
                                    adjustmentAmount {
                                          amount
                                    }
                                  }
                              }

                              ...on SellingPlanFixedPriceAdjustment {
                                  price {
                                    amount
                                  }
                              }

                              ... on SellingPlanPercentagePriceAdjustment {
                                  adjustmentPercentage
                              }
                            }
                        }
                      }
                      priceAdjustments {
                        compareAtPrice {
                            amount
                        }
                        price {
                            amount
                        }
                      }
                      remainingBalanceChargeAmount {
                        amount
                      }
                      checkoutChargeAmount {
                        amount
                      }
                  }
                }
            }
            sku
            title
            weight
            weightUnit
          }
      }
    }
    sellingPlanGroups(first: 50) {
      edges {
          node {
            appName
            name
            options {
                name
                values
            }
            sellingPlans(first: 50) {
                edges {
                  node {
                      description
                      id
                      name
                      recurringDeliveries
                      options {
                        name
                        value
                      }
                      priceAdjustments {
                        orderCount
                        adjustmentValue {
                            ...on SellingPlanPriceAdjustmentValue {
                              ...on SellingPlanFixedAmountPriceAdjustment {
                                  adjustmentAmount {
                                        amount
                                  }
                              }
                            }

                            ...on SellingPlanFixedPriceAdjustment {
                              price {
                                  amount
                              }
                            }

                            ... on SellingPlanPercentagePriceAdjustment {
                              adjustmentPercentage
                            }
                        }
                      }
                  }
                }
            }
          }
      }
    }`
}

function collectionsSchema(queryParams, withProducts) {
  if (queryParams.first) {
    var first = queryParams.first
  } else {
    var first = 250
  }

  if (queryParams.sortKey) {
    var sortKey = queryParams.sortKey.toUpperCase()
  } else {
    var sortKey = "TITLE"
  }

  var prodDefaultSchema = productsDefaultSchema(queryParams)

  var products = withProducts
    ? "products(first: " +
      first +
      " sortKey: " +
      sortKey +
      ") { pageInfo { hasNextPage hasPreviousPage } edges { cursor node { " +
      prodDefaultSchema +
      " } } }"
    : ""

  return `title
    handle
    id
    description
    descriptionHtml
    onlineStoreUrl
    image {
      width
      height
      altText
      id
      originalSrc
      transformedSrc
    }
    ${products}`
}

function cartSchema(cartData) {
  var metafields = ``

  if (cartData && cartData.metafields) {
    metafields = cartData.metafields
  }

  return `
  id
  note
  checkoutUrl
  createdAt
  updatedAt
  totalQuantity
  buyerIdentity {
    countryCode
    email
    phone
  }
  attributes {
    key
    value
  }
  cost {
    checkoutChargeAmount {
        amount
        currencyCode               
    }
    subtotalAmount {
        amount
        currencyCode
    }
    subtotalAmountEstimated
    totalAmount {
        amount
        currencyCode
    }
    totalAmountEstimated
    totalDutyAmount {
        amount
        currencyCode
    }
    totalDutyAmountEstimated
    totalTaxAmount {
        amount
        currencyCode
    }
    totalTaxAmountEstimated
  }
  discountCodes {
    applicable
    code
  }
  discountAllocations {
    discountedAmount {
        amount
        currencyCode
    }
  }
  lines(first: 250) {
    edges {
        node {
          id
          merchandise {
              ... on ProductVariant {
                product {
                    id
                    title
                    handle
                }
                availableForSale
                compareAtPrice {
                    amount
                    currencyCode
                }
                currentlyNotInStock
                id
                image {
                    width
                    height
                    altText
                    id
                    originalSrc
                    transformedSrc
                }
                ${metafields}
                price {
                    amount
                    currencyCode
                }
                quantityAvailable
                requiresShipping
                selectedOptions {
                    name 
                    value
                }
                sku
                title
                weight
                weightUnit
              }
          }
          quantity
          sellingPlanAllocation {
              priceAdjustments {
                price {
                    amount
                    currencyCode
                }
              }
              sellingPlan {
                description
                id
                name
                recurringDeliveries
                options {
                    name
                    value
                }
                priceAdjustments {
                    adjustmentValue 
                    orderCount
                }
                
              }
          }
          attributes {
              key
              value
          }
          discountAllocations {
              discountedAmount {
                amount
                currencyCode
              }
          }
          cost {
              amountPerQuantity {
                amount
                currencyCode
              }
              compareAtAmountPerQuantity {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
          }
        }
    }
  }`
}

function getCartQuery(cartData) {
  return `query($id: ID!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
    cart(id: $id) {
      ${cartSchema(cartData)}
    }
  }`
}

function createCartQuery(cartData) {
  return `mutation cartCreate($lines: [CartLineInput!], $note: String, $attributes: [AttributeInput!]!, $buyerIdentity: CartBuyerIdentityInput
, $discountCodes: [String!], $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartCreate(input: {
          lines: $lines, 
          note: $note, 
          attributes: $attributes, 
          discountCodes: $discountCodes, 
          buyerIdentity: $buyerIdentity
      }) 
      {
          cart {
            ${cartSchema(cartData)}
          }
          userErrors {
            field
            code
            message
          }
      }
    }`
}

function createAddLinesCartQuery(cartData) {
  return `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${cartSchema(cartData)}
        }
        userErrors {
          field
          code
          message
        }
    }
  }`
}

function createUpdateLinesCartQuery(cartData) {
  return `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
            ${cartSchema(cartData)}
        }
        userErrors {
            field
            message
        }
      }
  }`
}

function createRemoveLinesCartQuery(cartData) {
  return `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
            ${cartSchema(cartData)}
        }
        userErrors {
            field
            message
        }
      }
  }`
}

function createUpdateCartNoteQuery(cartData) {
  return `mutation cartNoteUpdate($cartId: ID!, $note: String!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartNoteUpdate(cartId: $cartId, note: $note) {
        cart {
            ${cartSchema(cartData)}
        }
        userErrors {
            field
            message
        }
      }
  }`
}

function createCartDiscountQuery(cartData) {
  return `mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
            ${cartSchema(cartData)}
        }
        userErrors {
            field
            message
        }
      }
  }`
}

function createUpdateCartAttributesQuery(cartData) {
  return `mutation cartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) 
    {
        cart {
          ${cartSchema(cartData)}
        }
        userErrors {
          code
          field
          message
        }
    }
  }`
}

/*

Used for updating existing carts, after a user logs in

*/
function createUpdateBuyerIdentityQuery(cartData) {
  return `mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
      cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
        cart {
            ${cartSchema(cartData)}
        }
        userErrors {
            field
            message
            code
        }
      }
  }`
}

function createGetallTagsQuery() {
  return `query {
    productTags(first:250) {
      edges {
          node
      }
    }
  }`
}

function createGetallTypesQuery() {
  return `query {
    productTypes(first:250) {
      edges {
          node
      }
    }
  }`
}

// TODO: It would be nice to call a productVendors query instead of looping through all products
function createGetallVendorsQuery() {
  return `query ($numProducts: Int!, $cursor: String) {
    products(first: $numProducts, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
          node {
            vendor
          }
      }
    }
  }`
}

function createGetProductsFromCollectionsQuery(queryParams) {
  return `query ProductByCollections($query: String, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $language: LanguageCode, $country: CountryCode, $buyer: BuyerInput, $cursor: String) @inContext(country: $country, language: $language, buyer: $buyer) {
    collections(first: 250, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                ${productsDefaultSchema(queryParams)}
              }
            }
          }
        }
      }
    }
  }`
}

function createCollectionsQuery(
  queryParams,
  withProducts = false,
  customSchema = false
) {
  var schema = customSchema
    ? customSchema
    : collectionsSchema(queryParams, withProducts)

  if (!queryParams.cursor) {
    delete queryParams.cursor
  }

  return `query($query: String!, $first: Int!, $cursor: String, $sortKey: CollectionSortKeys, $reverse: Boolean, $language: LanguageCode, $country: CountryCode) @inContext(country: $country, language: $language) {
    collections(first: $first, query: $query, after: $cursor, reverse: $reverse, sortKey: $sortKey) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
              ${schema}
          }
        }
    }
  }`
}

function makeGetCartQuery(cartData, shopState) {
  const variables = {
    id: cartData.id,
    language: shopState.language,
    country: cartData.buyerIdentity.countryCode,
  }

  return {
    query: getCartQuery(cartData),
    variables: variables,
  }
}

function makeCreateCartQuery(cartData, shopState) {
  var variables = {
    lines: cartData.lines ? cartData.lines : [],
    note: cartData.note ? cartData.note : "",
    attributes: cartData.attributes ? cartData.attributes : [],
    discountCodes: cartData.discountCodes ? cartData.discountCodes : [],
    language: shopState.language,
    country: cartData.buyerIdentity.countryCode,
  }

  if (
    cartData.buyerIdentity.customerAccessToken &&
    cartData.buyerIdentity.customerAccessToken !== ""
  ) {
    variables.buyerIdentity = {
      customerAccessToken: cartData.buyerIdentity.customerAccessToken,
    }

    if (
      cartData.buyerIdentity.companyLocationId &&
      cartData.buyerIdentity.companyLocationId !== ""
    ) {
      variables.buyerIdentity.companyLocationId =
        cartData.buyerIdentity.companyLocationId
    }
  }

  return {
    query: createCartQuery(cartData),
    variables: variables,
  }
}

function makeAddLinesCartQuery(cartData, shopState) {
  return {
    query: createAddLinesCartQuery(cartData),
    variables: {
      cartId: cartData.cartId,
      lines: cartData.lines ? cartData.lines : [],
      language: shopState.language,
      country: cartData.buyerIdentity.countryCode,
    },
  }
}

function makeUpdateLinesCartQuery(cartData, shopState) {
  return {
    query: createUpdateLinesCartQuery(cartData),
    variables: {
      cartId: cartData.cartId,
      lines: cartData.lines ? cartData.lines : [],
      language: shopState.language,
      country: cartData.buyerIdentity.countryCode,
      metafields: cartData.metafields ? cartData.metafields : false,
    },
  }
}

function makeRemoveLinesCartQuery(data) {
  return {
    query: createRemoveLinesCartQuery(data),
    variables: {
      cartId: data.cartId,
      lineIds: data.lineIds ? data.lineIds : [],
      language: data.buyerIdentity.language,
      country: data.buyerIdentity.countryCode,
    },
  }
}

function makeUpdateCartNoteQuery(data, shopState) {
  return {
    query: createUpdateCartNoteQuery(data),
    variables: {
      cartId: data.cartId,
      note: data.note ? data.note : "",
      language: shopState.language,
      country: data.buyerIdentity.countryCode,
    },
  }
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}

function formatDiscountCodes(data) {
  const existingDiscountCodes = data.existingDiscountCodes
    ? data.existingDiscountCodes.filter(onlyUnique)
    : []
  const discountToChange = data.discountToChange
  const isRemoving = data.isRemoving

  if (isRemoving) {
    var leftOvers = existingDiscountCodes.filter((discount) => {
      return discount.code !== discountToChange
    })

    var finalDiscountCodes = leftOvers.map((discount) => {
      return discount.code
    })
  } else {
    var finalDiscountCodes = existingDiscountCodes.map((discount) => {
      return discount.code
    })

    finalDiscountCodes.push(discountToChange)
  }

  finalDiscountCodes = finalDiscountCodes.filter(onlyUnique)

  return finalDiscountCodes
}

function makeUpdateCartDiscountQuery(data, shopState) {
  let discountCodes = formatDiscountCodes(data)

  return {
    query: createCartDiscountQuery(data),
    variables: {
      cartId: data.cartId,
      discountCodes: discountCodes,
      language: shopState.language,
      country: data.buyerIdentity.countryCode,
    },
  }
}

function makeUpdateCartAttributesQuery(data, shopState) {
  return {
    query: createUpdateCartAttributesQuery(data),
    variables: {
      cartId: data.cartId,
      attributes: data.attributes ? data.attributes : [],
      language: shopState.language,
      country: data.buyerIdentity.countryCode,
    },
  }
}

function makeUpdateBuyerIdentityQuery(data, shopState) {
  var variables = {
    cartId: data.cartId,
    buyerIdentity: data.buyerIdentity ? data.buyerIdentity : false,
    language: shopState.language,
    country: data.buyerIdentity.countryCode,
  }

  if (
    data.buyerIdentity.customerAccessToken &&
    data.buyerIdentity.customerAccessToken !== ""
  ) {
    variables.buyerIdentity = {
      customerAccessToken: data.buyerIdentity.customerAccessToken,
    }
    if (
      data.buyerIdentity.companyLocationId &&
      data.buyerIdentity.companyLocationId !== ""
    ) {
      variables.buyerIdentity.companyLocationId =
        data.buyerIdentity.companyLocationId
    }
  }

  var toSend = {
    query: createUpdateBuyerIdentityQuery(data),
    variables: variables,
  }

  return toSend
}

function makeGetAllTagsQuery(data) {
  return {
    query: createGetallTagsQuery(),
    variables: false,
  }
}

function makeGetAllTypesQuery(data) {
  return {
    query: createGetallTypesQuery(),
    variables: false,
  }
}

function makeGetAllVendorsQuery(cursor = null) {
  return {
    query: createGetallVendorsQuery(),
    variables: {
      numProducts: 250,
      cursor: cursor,
    },
  }
}

function makeGetProductsFromCollectionsQuery(queryParams) {
  return {
    query: createGetProductsFromCollectionsQuery(queryParams),
    variables: queryParams,
  }
}

function makeGetCollectionsQuery(data) {
  return {
    query: createCollectionsQuery(
      data.queryParams,
      data.withProducts,
      data.customSchema
    ),
    variables: data.queryParams,
  }
}

export {
  doGraphQuery,
  makeProductsQuery,
  makeGetCartQuery,
  makeCreateCartQuery,
  makeAddLinesCartQuery,
  makeUpdateLinesCartQuery,
  makeRemoveLinesCartQuery,
  makeUpdateCartNoteQuery,
  makeUpdateCartDiscountQuery,
  makeUpdateCartAttributesQuery,
  makeUpdateBuyerIdentityQuery,
  makeGetAllTagsQuery,
  makeGetAllTypesQuery,
  makeGetAllVendorsQuery,
  makeGetProductsFromCollectionsQuery,
  makeGetCollectionsQuery,
}
