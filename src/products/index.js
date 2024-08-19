import { maybeHandleApiError } from "../errors"
import { to } from "@shopwp/common"
import { getProducts, getProductsByCollections } from "../internal/cart"
import { getCache, maybeSetCache, clearCache } from "../cache"

function fetchProducts(queryParams, shopState, cursor = false) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      console.error(shopState.t.e.noQueryParams)

      reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    if (queryParams?.sortKey) {
      queryParams.sortKey = queryParams.sortKey.toUpperCase()
    }

    if (cursor) {
      queryParams.cursor = cursor
    } else {
      delete queryParams.cursor
    }

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(getCache(queryParams))

      var errMsg = maybeHandleApiError(queryCacheError, queryCache)

      if (errMsg) {
        return reject({
          type: "error",
          message: errMsg,
        })
      }

      if (queryCache) {
        if (queryCache.cacheKey === shopwp.misc.cacheKey) {
          return resolve(queryCache)
        }
      }

      if (queryCache && queryCache.cacheKey !== shopwp.misc.cacheKey) {
        clearCache()
      }
    }

    const [resultsError, results] = await to(
      getProducts(queryParams, shopState.client)
    )

    var maybeApiError = maybeHandleApiError(resultsError, results)

    if (maybeApiError) {
      reject({
        type: "error",
        message: maybeApiError,
      })
      return
    }

    maybeSetCache({
      cacheType: "products",
      dataToHash: queryParams,
      dataToCache: results.products,
    })

    resolve(results.products)
  })
}

function makeArrayOfOnlyProducts(apiResults) {
  var finalProducts = []

  apiResults.collections.edges.forEach((collection) => {
    if (collection.node.products.edges.length) {
      finalProducts = finalProducts.concat(collection.node.products.edges)
    }
  })

  var returnOb = {
    edges: finalProducts,
  }

  if (apiResults.collections.edges.length === 1) {
    returnOb.pageInfo = {
      hasNextPage:
        apiResults.collections.edges[0].node.products.pageInfo.hasNextPage,
      hasPrevPage: false,
      cursor: apiResults.collections.edges[0].node.products.pageInfo.endCursor,
    }
  } else {
    returnOb.pageInfo = {
      hasNextPage: false,
      hasPrevPage: false,
      cursor: false,
    }
  }

  return returnOb
}

function fetchProductsByCollections(queryParams, shopState, cursor = false) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      return reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    if (queryParams?.sortKey) {
      queryParams.sortKey = queryParams.sortKey.toUpperCase()
    }

    if (queryParams?.first) {
      queryParams.first = parseInt(queryParams.first, 10)
    }

    if (cursor) {
      queryParams.cursor = cursor
    } else {
      delete queryParams.cursor
    }

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(getCache(queryParams))

      var errorMsg = maybeHandleApiError(queryCacheError, queryCache)

      if (errorMsg) {
        return reject({
          type: "error",
          message: errorMsg,
        })
      }

      if (queryCache) {
        if (queryCache.cacheKey === shopwp.misc.cacheKey) {
          return resolve(queryCache)
        }
      }

      if (queryCache && queryCache.cacheKey !== shopwp.misc.cacheKey) {
        clearCache()
      }
    }

    const [resultsError, results] = await to(
      getProductsByCollections(queryParams, shopState.client)
    )

    var maybeApiError = maybeHandleApiError(resultsError, results)

    if (maybeApiError) {
      reject({
        type: "error",
        message: maybeApiError,
      })
      return
    }

    let onlyProducts = makeArrayOfOnlyProducts(results)

    maybeSetCache({
      cacheType: "collectionProducts",
      dataToHash: queryParams,
      dataToCache: onlyProducts,
    })

    return resolve(onlyProducts)
  })
}

export { fetchProducts, fetchProductsByCollections }
