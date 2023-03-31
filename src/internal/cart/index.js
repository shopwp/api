import { get, post } from "../request"

function getCart(data) {
  return get("cart/get?data=" + btoa(JSON.stringify(data)))
}

function createCart(data) {
  return post("cart/create", data)
}

function updateCartAttributes(data) {
  return post("cart/attributes/update", data)
}

function updateBuyerIdentity(data) {
  return post("cart/buyer/update", data)
}

function addLineItems(data) {
  return post("cart/lineitems/add", data)
}

function removeLineItems(data) {
  return post("cart/lineitems/remove", data)
}

function updateLineItems(data) {
  return post("cart/lineitems/update", data)
}

function applyDiscount(data) {
  return post("cart/discount", data)
}

function updateNote(data) {
  return post("cart/note/update", data)
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
