export { fetchProducts, fetchProductsByCollections } from "./src/products"
export { fetchCollections } from "./src/collections"

export {
  getLocalizations,
  sanitizeTranslations,
  findCountryByCode,
  sanitizeCountries,
} from "./src/shop"

export {
  makeProductsQuery,
  makeGetCartQuery,
  doGraphQuery,
} from "./src/api/query"

export { getTemplate } from "./src/internal/components"
export {
  fetchMaskedConnection,
  saveConnectionLocally,
} from "./src/internal/connection"

export { getPosts } from "./src/internal/posts"
export { post } from "./src/internal/request"

export { getAvailableLocalizations } from "./src/internal/translator"
export {
  setLicenseLocally,
  deactivateLicenseKeyNew,
  deleteLicenseLocally,
  getActiveDownloadsLocally,
  deactivateLicenseKeyRemote,
  activateLicenseKeyRemote,
  getLicenseKeyStatusRemote,
  getProductInfoRemote,
  updatePaymentMethod,
  updateCustomer,
} from "./src/internal/license"

export {
  activateYotpoApiKey,
  deactivateYotpoApiKey,
  getYotpoReviews,
  getYotpoReviewsByProductId,
  createYotpoReview,
} from "./src/internal/reviews"

export {
  createCart,
  updateCartAttributes,
  getCart,
  addLineItems,
  removeLineItems,
  updateLineItems,
  applyDiscount,
  updateNote,
  getAllTags,
  getAllTypes,
  getAllVendors,
  getProducts,
  getProductsByCollections,
  getCollections,
  updateBuyerIdentity,
} from "./src/internal/cart"

export {
  getSyncingStatus,
  setSyncingIndicator,
  syncRemove,
  syncOn,
  syncOff,
  scheduleNewCron,
  syncAndScheduleNewCron,
  disconnectCron,
  updateSettings,
  removeConnection,
  syncShopifyData,
  manuallyCancelSync,
  syncRemoveImages,
  removeWebhooks,
  connectWebhooks,
} from "./src/internal/syncing"

export { clearCacheTool } from "./src/internal/tools"

export {
  maybeAlterErrorMessage,
  maybeHandleApiError,
  getWordPressErrorMessage,
  isWordPressError,
} from "./src/errors"

export {
  loginCustomer,
  associateCustomer,
  resetPasswordCustomer,
  setPasswordCustomer,
  resetPasswordByUrlCustomer,
  registerCustomer,
  getCustomer,
  updateCustomerAddress,
  addCustomerAddress,
  deleteCustomerAddress,
} from "./src/internal/customers"

export { queryOptionsNoRefetch, queryOptionsWithRefetch } from "./src/queries"

export { fetchPostById, editPost } from "./src/wordpress"
export { getCache, maybeSetCache, clearCache } from "./src/cache"
