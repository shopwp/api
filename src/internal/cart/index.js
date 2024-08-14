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
} from "../../api/query"

function getCart(data, client) {
  return doGraphQuery(makeGetCartQuery(data), client)
}

function createCart(data, client) {
  return doGraphQuery(makeCreateCartQuery(data), client)
}

function addLineItems(data, client) {
  return doGraphQuery(makeAddLinesCartQuery(data), client)
}

function updateLineItems(data, client) {
  return doGraphQuery(makeUpdateLinesCartQuery(data), client)
}

function removeLineItems(data, client) {
  return doGraphQuery(makeRemoveLinesCartQuery(data), client)
}

function updateNote(data, client) {
  return doGraphQuery(makeUpdateCartNoteQuery(data), client)
}

function applyDiscount(data, client) {
  return doGraphQuery(makeUpdateCartDiscountQuery(data), client)
}

function updateCartAttributes(data, client) {
  return doGraphQuery(makeUpdateCartAttributesQuery(data), client)
}

function updateBuyerIdentity(data, client) {
  return doGraphQuery(makeUpdateBuyerIdentityQuery(data), client)
}

function getAllTags(client) {
  return doGraphQuery(makeGetAllTagsQuery(), client)
}

function getAllTypes(client) {
  return doGraphQuery(makeGetAllTypesQuery(), client)
}

function getProducts(data, client) {
  return doGraphQuery(makeProductsQuery(data), client)
}

function getProductsByCollections(data, client) {
  var stuff = makeGetProductsFromCollectionsQuery(data)

  return doGraphQuery(stuff, client)
}

function getCollections(data, client) {
  return doGraphQuery(makeGetCollectionsQuery(data), client)
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

async function getAllVendors(client) {
  const [err, data] = await to(
    getEverything({
      client: client,
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
