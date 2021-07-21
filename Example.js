"use strict";
const Http = require("./Http");

class ProxyMZ {
	constructor({ accessToken }) {
		this.accessToken = accessToken;
		this.BASE_API = "https://api.proxymz.com/api";
	}
	/**
	 * Lây thông tin tài khoản
	 * @method GET
	 * @param accessToken
	 */
	static async me(req, res) {
		let response = await Http.get(`${this.BASE_API}/me`, this.accessToken);
		if (response.username) {
			// Lấy thông tin thành công truy cập vào đây để xem response -> https://proxymz.com/developer/api
			res.json({ success: true });
		} else {
			// Lấy thông tin tài khoản không thành công
			res.json({ success: false });
		}
	}
	/**
	 * Tạo đơn hàng Proxy Private/Shared và thanh toan toán đơn hàng trong 1 bước
	 * @method POST
	 * @param accessToken
	 * @param country quốc gia theo ký hiệu ISO: ví dụ VN
	 * @param serviceType Loại dịch vụ chỉ cho phép: IPv4, IPv6, IPv4Shared
	 * @param period thời hạn chỉ định mua proxy được phép [3|7|14|30|60|90|180|365]
	 * @param quantity số lượng proxy muốn mua, tối thiểu là 1 tối đa là 1000 proxy
	 */
	static async createInCheckout(req, res) {
		const { country = "VN", serviceType = "IPv6", period = 3, quantity = 1, connectMethod = "HTTP" } = req.body;
		let response = await Http.post(`${this.BASE_API}/orders/proxies`, this.accessToken, {
			country,
			serviceType,
			period,
			quantity,
		});
		if (response.success) {
			let ReferenceID = response.data.ReferenceID; // Sử dụng mã này để thanh toán đơn hàng hoặc TransactionID, HashID, _id, ReferenceID (Đểu có thể sử dụng cho việc thanh toán)
			let checkout = await Http.post(`${this.BASE_API}/orders/proxies/${ReferenceID}/checkout`, this.accessToken, {
				connectMethod,
			});
			if (checkout.success) {
				// Thanh toán đơn hàng thành công
				checkout.data.map((item) => {
					// Hiền thị danh sách proxy đã mua thành công
					let ServiceCode = item.ServiceCode; // Lưu ý hãy lưu ServiceCode lại để sử dụng cho việc gia hạn Proxy
				});
				res.json({ success: true });
			} else {
				// Thanh toán đơn hàng không thành công
				res.json({ success: false });
			}
		} else {
			// Tạo đơn hàng không thành công
			res.json({ success: false });
		}
	}
	/**
	 * Tạo đơn gia hạn và thanh toán đơn hàng gia hạn
	 * @method POST
	 * @param accessToken
	 * @param serviceList array danh sách ServiceCode được định nghĩa ["ABCDC","HICAS","HEHE]
	 * @param period thời hạn chỉ định mua proxy được phép [3|7|14|30|60|90|180|365]
	 */
	static async renewalInCheckout(req, res) {
		const { serviceList = ["ABCDC", "HIEC"], period = 3 } = req.body;
		let response = await Http.post(`${this.BASE_API}/proxy/renewal`, this.accessToken, {
			serviceList,
			period,
		});
		if (response.success) {
			let ReferenceID = response.data.ReferenceID; // Sử dụng mã này để thanh toán đơn hàng hoặc TransactionID, HashID, _id, ReferenceID (Đểu có thể sử dụng cho việc thanh toán)
			let checkout = await Http.post(`${this.BASE_API}/orders/proxies/${ReferenceID}/renewal`, this.accessToken);
			if (checkout.success) {
				// Thanh toán đơn hàng gia hạn thành công
				res.json({ success: true });
			} else {
				// Thanh toán đơn hàng gia hạn không thành công
				res.json({ success: false });
			}
		} else {
			// Tạo đơn hàng gia hạn không thành công
			res.json({ success: false });
		}
	}
	/**
	 * Sử dụng mã giảm giá cho đơn hàng
	 * @method PUT
	 * @param ReferenceID mã đơn hàng
	 * @param couponName mã giảm giá
	 */
	static async applyCoupon(req, res) {
		const { ReferenceID, couponName = 3 } = req.body;
		let response = await Http.put(`${this.BASE_API}/orders/proxies/${ReferenceID}`, this.accessToken, {
			couponName,
		});
		if (response.success) {
			// Sử dụng mã giảm giá cho đơn hàng thành công
			res.json({ success: true });
		} else {
			// Sử dụng mã giảm giá cho đơn hàng không thành công
			res.json({ success: false });
		}
	}
	/**
	 * Bật tự động gia hạn hoặc tắt tự động gia hạn
	 * @method POST
	 * @param serviceList array danh sách ServiceCode được định nghĩa ["ABCDC","HICAS","HEHE]
	 * @param type ON=Bật tự động gia hạn; OFF=Tắt tự động gia hạn;
	 */
	static async setAutoRenewal(req, res) {
		const { serviceList = ["ABCDC", "HIEC"], type = "ON" } = req.body;
		let response = await Http.post(`${this.BASE_API}/proxy/autorenewal"`, this.accessToken, {
			serviceList,
			type,
		});
		if (response.success) {
			if (type == "ON") {
				// Bật tự động gia hạn thành công
			} else {
				// Tắt tự động gia hạn thành công
			}
			res.json({ success: true });
		} else {
			// Báo lỗi trong qua trình bật tự động hạn hoặc tắt tự động gia hạn
			res.json({ success: false });
		}
	}
	/**
	 * Huỷ proxy theo proxy đã chọn
	 * @method POST
	 * @param serviceList array danh sách ServiceCode được định nghĩa ["ABCDC","HICAS","HEHE] để sử dụng xoá
	 */
	static async destroyProxy(req, res) {
		const { serviceList = ["ABCDC", "HIEC"] } = req.body;
		let response = await Http.post(`${this.BASE_API}/proxy/delete"`, this.accessToken, {
			serviceList,
		});
		if (response.success) {
			// Xoá proxy thành công
			response.data.map((item) => {
				// thông tin danh sách proxy bị xoá sẽ hiện tại đây
			});
			res.json({ success: true });
		} else {
			// Báo lỗi trong quá trình xoá proxy
			res.json({ success: false });
		}
	}
	/**
	 * Lấy danh sách thông tin đơn hàng
	 * @method POST
	 * @param ordersList Mã đơn hàng GET response
	 */
	static async getListOrders(req, res) {
		const { type, countries, service, status, sort, page = 0, limit = 5000 } = req.query;
		let query = URLSearchParams({ type, countries, service, status, sort, page, limit });
		let response = await Http.get(`${this.BASE_API}/orders?${query}`, this.accessToken);
		if (response.success) {
			// Lấy thông tin đơn hàng thành công
			// {
			//     data: [...],
			//     ipAddress: ""
			//     message: "Lấy danh sách đơn hàng thành công"
			//     success: true,
			//     summary: {
			//         totalRecord: 5000,
			//         before: {
			//             nextPage: 1 // Nếu nextPage tăng thì tăng giá trị Page lên 1 số nếu page=0 thì ta dùng chuyển thành page=1
			//         }
			//     },
			//     userAgent: ""
			// }
			response.data.map((item) => {
				// Response đơn hàng
			});
			res.json({ success: true });
		} else {
			// Lấy thông tin đơn hàng không thành công
			res.json({ success: false });
		}
	}
	/**
	 * Xoá đơn hàng
	 * Desc: Điều kiện đơn hàng đó chưa thanh toán có thể xoá
	 * @method POST
	 * @param ordersList Mã đơn hàng GET response
	 */
	static async destroyOrders(req, res) {
		const { ordersList = ["ABCDC", "HIEC"] } = req.body;
		let response = await Http.post(`${this.BASE_API}/orders/delete"`, this.accessToken, {
			ordersList,
		});
		if (response.success) {
			// Xoá đơn hàng thành công
			res.json({ success: true });
		} else {
			// Báo lỗi trong quá trình xoá proxy
			res.json({ success: false });
		}
	}
}

module.exports = ProxyMZ;
