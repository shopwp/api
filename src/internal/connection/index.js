import { post } from '../request'

function fetchMaskedConnection(params) {
	return post('connection/mask', params)
}

function saveConnectionLocally(data) {
	return post('connection', data)
}
export { fetchMaskedConnection, saveConnectionLocally }
