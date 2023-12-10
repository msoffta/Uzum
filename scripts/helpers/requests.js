import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export const get = async (url) => {
	try {
		console.log(url);
		const response = await axios.get(baseUrl + url);
		return response;
	} catch (error) {
		console.log(error);
	}
};

export const post = async (url, data) => {
	try {
		const response = await axios.post(baseUrl + url, data);
		return response.data, response.status;
	} catch (error) {
		console.log(error);
	}
};

export const put = async (url, data) => {
	try {
		const response = await axios.put(baseUrl + url, data);
		return response.data, response.status;
	} catch (error) {
		console.log(error);
	}
};

export const del = async (url) => {
	try {
		const response = await axios.delete(baseUrl + url);
		return response.data, response.status;
	} catch (error) {
		console.log(error);
	}
};
