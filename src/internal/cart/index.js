import { get, post } from "../request"

function jsF(d) {
  return wp.hooks.applyFilters("cart.requestSettings", d)
}

function getCart(data) {
  return get("cart/get?data=" + btoa(JSON.stringify(jsF(data))))
}

function createCart(data) {
  return post("cart/create", jsF(data))
}

function updateCartAttributes(data) {
  return post("cart/attributes/update", jsF(data))
}

function updateBuyerIdentity(data) {
  return post("cart/buyer/update", jsF(data))
}

function addLineItems(data) {
  return post("cart/lineitems/add", jsF(data))
}

function removeLineItems(data) {
  return post("cart/lineitems/remove", jsF(data))
}

function updateLineItems(data) {
  return post("cart/lineitems/update", jsF(data))
}

function applyDiscount(data) {
  return post("cart/discount", jsF(data))
}

function updateNote(data) {
  return post("cart/note/update", jsF(data))
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
}
