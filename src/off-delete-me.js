export { fetchProducts, fetchProductsByCollections } from "./products"
export { fetchCollections } from "./collections"

export {
  getLocalizations,
  sanitizeTranslations,
  findCountryByCode,
  sanitizeCountries,
} from "./shop"

export { makeProductsQuery, makeGetCartQuery, doGraphQuery } from "./api/query"

export { getTemplate } from "./internal/components"
export {
  fetchMaskedConnection,
  saveConnectionLocally,
} from "./internal/connection"

export { getPosts } from "./internal/posts"

export { post } from "./internal/request"

export { getAvailableLocalizations } from "./internal/translator"
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
} from "./internal/license"

export {
  activateYotpoApiKey,
  deactivateYotpoApiKey,
  getYotpoReviews,
  getYotpoReviewsByProductId,
  createYotpoReview,
} from "./internal/reviews"

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
} from "./internal/cart"

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
} from "./internal/syncing"

export { clearCache } from "./internal/tools"

export {
  maybeAlterErrorMessage,
  maybeHandleApiError,
  isWordPressError,
  getWordPressErrorMessage,
} from "./errors"

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
} from "./internal/customers"

export { queryOptionsNoRefetch, queryOptionsWithRefetch } from "./queries"
