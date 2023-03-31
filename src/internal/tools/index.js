import { post } from "../request"

function clearCache() {
  return post("cache")
}

export { clearCache }
