import to from "await-to-js"

import {
  doGraphQuery,
  makeGetCartQuery,
  makeCreateCartQuery,
  makeAddLinesCartQuery,
  makeUpdateLinesCartQuery,
  makeRemoveLinesCartQuery,
  makeUpdateCartNoteQuery,
  makeUpdateCartDiscountQuery,
  makeUpdateCartAttributesQuery,
  makeGetAllTagsQuery,
  makeGetAllTypesQuery,
  makeGetAllVendorsQuery,
  makeProductsQuery,
  makeGetProductsFromCollectionsQuery,
  makeGetCollectionsQuery,
  makeUpdateBuyerIdentityQuery,
} from "../../api/query"

function getCart(data, shopState) {
  return doGraphQuery(makeGetCartQuery(data, shopState), shopState.client)
}

function createCart(data, shopState) {
  return doGraphQuery(makeCreateCartQuery(data, shopState), shopState.client)
}

function addLineItems(data, shopState) {
  return doGraphQuery(makeAddLinesCartQuery(data, shopState), shopState.client)
}

function updateLineItems(data, shopState) {
  return doGraphQuery(
    makeUpdateLinesCartQuery(data, shopState),
    shopState.client
  )
}

function removeLineItems(data, shopState) {
  return doGraphQuery(
    makeRemoveLinesCartQuery(data, shopState),
    shopState.client
  )
}

function updateNote(data, shopState) {
  return doGraphQuery(
    makeUpdateCartNoteQuery(data, shopState),
    shopState.client
  )
}

function applyDiscount(data, shopState) {
  return doGraphQuery(
    makeUpdateCartDiscountQuery(data, shopState),
    shopState.client
  )
}

function updateCartAttributes(data, shopState) {
  return doGraphQuery(
    makeUpdateCartAttributesQuery(data, shopState),
    shopState.client
  )
}

function updateBuyerIdentity(data, shopState) {
  var updateBuyerIdentityVariables = makeUpdateBuyerIdentityQuery(
    data,
    shopState
  )

  return doGraphQuery(updateBuyerIdentityVariables, shopState.client)
}

function getAllTags(shopState) {
  return doGraphQuery(makeGetAllTagsQuery(), shopState.client)
}

function getAllTypes(shopState) {
  return doGraphQuery(makeGetAllTypesQuery(), shopState.client)
}

function getProducts(data, shopState) {
  return doGraphQuery(makeProductsQuery(data, shopState), shopState.client)
}

function getProductsByCollections(data, shopState) {
  var stuff = makeGetProductsFromCollectionsQuery(data)

  return doGraphQuery(stuff, shopState.client)
}

function getCollections(data, shopState) {
  return doGraphQuery(makeGetCollectionsQuery(data), shopState.client)
}

async function getEverything(options) {
  const [err, data] = await to(
    doGraphQuery(options.queryFn(options.cursor), options.client)
  )

  if (err) {
    throw err
  }

  let newResults = options.results.concat(data.products.edges)

  if (data.products.pageInfo.hasNextPage) {
    return getEverything({
      client: options.client,
      cursor: data.products.pageInfo.endCursor,
      results: newResults,
      queryFn: options.queryFn,
    })
  } else {
    // No more pages left—let's process and get outta here.
    return newResults
  }
}

async function getAllVendors(shopState) {
  const [err, data] = await to(
    getEverything({
      client: shopState.client,
      results: [],
      cursor: null,
      queryFn: makeGetAllVendorsQuery,
    })
  )

  if (err) {
    throw err
  }

  return {
    data: {
      edges: data,
    },
  }
}

export {
  createCart,
  applyDiscount,
  getCart,
  addLineItems,
  removeLineItems,
  updateLineItems,
  updateNote,
  updateCartAttributes,
  updateBuyerIdentity,
  getAllTags,
  getAllTypes,
  getAllVendors,
  getProducts,
  getProductsByCollections,
  getCollections,
}
