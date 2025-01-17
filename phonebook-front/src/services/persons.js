import axios from "axios"
const baseUrl = "/api/persons"

const getAll = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
}

const create = newObj => {
    return axios.post(baseUrl, newObj)
        .then(response => response.data)
}

const update = (id, newObj) => {
    return axios.put(`${baseUrl}/${id}`, newObj)
        .then(response => response.data)
}

const deleteItem = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
        .then(res => {
            return res.data
        })
}
export default { getAll, create, update, deleteItem }