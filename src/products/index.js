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
      getProducts(queryParams, shopState)
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

function makeArrayOfOnlyProducts(apiResults, queryParams) {
  var finalProducts = []

  apiResults.collections.edges.forEach((collection) => {
    /*
  
    TODO: This check will make sure to only return products that belong to the specific collection.
    By default, Shopify will check if the term is found anywhere in the field for all tokenized fields (which title is one of them).

    Since we're filtering the returned results after making the query, we should think about a better way to do this as this could have
    negative implications on pagination and filtering.
    
    */
    if (
      queryParams.query
        .toLowerCase()
        .includes(collection.node.title.toLowerCase())
    ) {
      if (collection.node.products.edges.length) {
        finalProducts = finalProducts.concat(collection.node.products.edges)
      }
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

function createTitleQueryFromValues(values) {
  return values.reduce((prev, current, index) => {
    if (!current || !current.label) {
      return prev + `(title:"${current}")`
    }
    if (index === 0) {
      prev = prev + `(title:"${current.label}")`
    } else {
      prev = prev + ` OR (title:"${current.label}")`
    }

    return prev
  }, "")
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

    if (queryParams.ids) {
      var collectionProductsQuery = createTitleQueryFromValues(queryParams.ids)

      queryParams.query = collectionProductsQuery
    } else if (queryParams.collection_titles) {
      if (
        typeof queryParams.collection_titles === "string" ||
        queryParams.collection_titles instanceof String
      ) {
        var titles = [queryParams.collection_titles]
      } else if (Array.isArray(queryParams.collection_titles)) {
        var titles = queryParams.collection_titles
      }
      var collectionProductsQuery = createTitleQueryFromValues(titles)

      queryParams.query = collectionProductsQuery
    }

    const [resultsError, results] = await to(
      getProductsByCollections(queryParams, shopState)
    )

    var maybeApiError = maybeHandleApiError(resultsError, results)

    if (maybeApiError) {
      reject({
        type: "error",
        message: maybeApiError,
      })
      return
    }

    let onlyProducts = makeArrayOfOnlyProducts(results, queryParams)

    maybeSetCache({
      cacheType: "collectionProducts",
      dataToHash: queryParams,
      dataToCache: onlyProducts,
    })

    return resolve(onlyProducts)
  })
}

export { fetchProducts, fetchProductsByCollections }
