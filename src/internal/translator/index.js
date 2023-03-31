import { get } from "../request"

function getAvailableLocalizations() {
  return get("translator/available")
}

export { getAvailableLocalizations }
