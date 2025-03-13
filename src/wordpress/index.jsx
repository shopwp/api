async function fetchPostById(postId, postType) {
  return new Promise(function (resolve, reject) {
    wp.apiFetch({
      path: `/wp/v2/${postType}/${postId}`,
      headers: {
        "X-WP-Nonce": shopwp.api.nonce,
      },
    })
      .then((resp) => {
        resolve(resp)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// This forces the useEffect on entityRecordEdits to run. Look in: src/_controls/wrapper.jsx
function editPost(data) {
  const { editPost } = wp.data.dispatch("core/editor")
  editPost(data)
}

export { fetchPostById, editPost }
