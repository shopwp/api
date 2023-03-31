import { post } from '../request'

function showMetafield(data) {
	return post('metafields/show', data)
}

function hideMetafield(data) {
	return post('metafields/hide', data)
}

export { showMetafield, hideMetafield }
