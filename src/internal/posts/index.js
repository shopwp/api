import { post } from "../request"

function getPosts(data) {
  return post("posts", {
    data: data,
  })
}

export { getPosts }
