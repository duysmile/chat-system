import axios from 'axios';

const baseRoot = 'http://localhost:3001';

export default class RequestHelper {
    static async get(path, headers = {}) {
        const url = baseRoot + path;
        const newHeaders = Object.assign({}, {
            'Content-Type': 'application/json', 
        }, headers);
        const token = localStorage.getItem('access_token');
        if (!!token && !headers.authorization) {
            newHeaders.Authorization = `Bearer ${token}`;
        }
        const response = await axios.get(url, {
            headers: newHeaders
        });
        if (response.status === 200) {
            return response.data
        }
        return null; 
    }
    
    static async post(path, body, headers = {}) {
        const url = baseRoot + path;
        const newHeaders = Object.assign({}, {
            'content-type': 'application/json', 
        }, headers);
        const token = localStorage.getItem('access_token');
        if (!!token && !headers.authorization) {
            newHeaders.Authorization = `Bearer ${token}`;
        }
        const response = await axios.post(url, body, {
            headers: newHeaders
        });
        if (response.status === 200) {
            return response.data
        }
        return null; 
    }
    
    static async put(path, body, headers = {}) {
        const url = baseRoot + path;
        const newHeaders = Object.assign({}, {
            'Content-Type': 'application/json', 
        }, headers);
        const token = localStorage.getItem('access_token');
        if (!!token && !headers.authorization) {
            newHeaders.Authorization = `Bearer ${token}`;
        }
        const response = await axios.put(url, body, {
            headers: newHeaders
        });
        if (response.status === 200) {
            return response.data
        }
        return null;  
    }
}
