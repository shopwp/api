import { get, set, clear } from "idb-keyval"

/*

Params:
{
    cacheType: "products", "collections", "collectionProducts", "cart",
    dataToHash: // The data used to generate a cache key
    dataToCache: // The data to cache 
}

*/
function maybeSetCache(params) {
  if (!shopwp.misc.cacheEnabled) {
    return params.dataToCache
  }

  if (
    params.cacheType === "products" ||
    params.cacheType === "cart" ||
    params.cacheType === "collections"
  ) {
    var finalResults = params.dataToCache
  }

  if (params.cacheType === "collectionProducts") {
    var finalResults = params.dataToCache.data
  }

  if (!finalResults) {
    return params.dataToCache
  }

  finalResults.cacheKey = shopwp.misc.cacheKey

  set(btoa(encodeURI(JSON.stringify(params.dataToHash))), finalResults)

  return finalResults
}

function getCache(queryParams) {
  try {
    var decoded = btoa(encodeURI(JSON.stringify(queryParams)))
  } catch (error) {
    return Promise.reject(
      "ShopWP Error: Unable to display products. You may be using unsupported characters in your ShopWP shortcode like €, or an emoji. Please check again."
    )
  }

  return get(decoded)
}

function clearCache() {
  clear()
}

export { getCache, maybeSetCache, clearCache }
