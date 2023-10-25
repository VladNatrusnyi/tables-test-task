import axios from "axios";

export const BASE_URL = 'https://technical-task-api.icapgroupgmbh.com/api'

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});
