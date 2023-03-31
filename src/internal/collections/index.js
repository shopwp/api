import { get, post } from "../request"

function getAllCollections() {
  if (shopwp.collectionsData) {
    return Promise.resolve(shopwp.collectionsData)
  }

  return get("collections/all")
}

function getCollections(data) {
  return post("collections", {
    data: data,
  })
}

export { getAllCollections, getCollections }
