import axios from 'axios'

axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = window.localStorage.getItem('access_token')
    return config
})

export default instance