"use strict";
const axios = require("axios");

let Http = {
	get: async (path, token = null) => {
		let options = {};
		if (token) options.headers = { Authorization: "Bearer " + token };
		return axios
			.get(path, options)
			.then((res) => {
				res.data.success = true;
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					return {
						success: false,
						status: error.response.status,
						...error.response.data,
					};
				}

				return { errors: error.message };
			});
	},
	post: async (path, token = null, postData = {}) => {
		let options = {};
		if (token) options.headers = { Authorization: "Bearer " + token };
		return axios
			.post(path, postData, options)
			.then((res) => {
				res.data.success = true;
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					return {
						success: false,
						status: error.response.status,
						...error.response.data,
					};
				}

				return { errors: error.message };
			});
	},
	put: async (path, token = null, postData = {}) => {
		let options = {};
		if (token) options.headers = { Authorization: "Bearer " + token };
		return axios
			.put(path, postData, options)
			.then((res) => {
				res.data.success = true;
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					return {
						success: false,
						status: error.response.status,
						...error.response.data,
					};
				}

				return { errors: error.message };
			});
	},
	patch: async (path, token = null, postData = {}) => {
		let options = {};
		if (token) options.headers = { Authorization: "Bearer " + token };
		return axios
			.patch(path, postData, options)
			.then((res) => {
				res.data.success = true;
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					return {
						success: false,
						status: error.response.status,
						...error.response.data,
					};
				}

				return { errors: error.message };
			});
	},
	delete: async (path, token = null) => {
		let options = {};
		if (token) options.headers = { Authorization: "Bearer " + token };
		return axios
			.delete(path, options)
			.then((res) => {
				res.data.success = true;
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					return {
						success: false,
						status: error.response.status,
						...error.response.data,
					};
				}

				return { errors: error.message };
			});
	},
};

module.exports = Http;
