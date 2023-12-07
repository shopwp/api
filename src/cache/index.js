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

  set(btoa(JSON.stringify(params.dataToHash)), finalResults)

  return finalResults
}

function getCache(queryParams) {
  return get(btoa(JSON.stringify(queryParams)))
}

function clearCache() {
  clear()
}

export { getCache, maybeSetCache, clearCache }
