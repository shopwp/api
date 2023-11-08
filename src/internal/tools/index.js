import { post } from "../request"

function clearCacheTool() {
  return post("cache")
}

export { clearCacheTool }
