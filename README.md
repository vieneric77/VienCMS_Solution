# ĐỒ ÁN MÔN HỌC - HỆ THỐNG Bán Sách Trực Tuyến

## Thông tin sinh viên

* Họ và tên: Huỳnh Thái Viên
* MSSV: 2123110123
* Lớp: CCQ2311D

### 1. Phân hệ Quản trị (Admin CMS)

Được xây dựng bằng ASP.NET Core MVC, hỗ trợ:

* Quản lý danh mục sản phẩm
* Quản lý sản phẩm
* Quản lý khách hàng
* Quản lý đơn hàng
* Quản lý nhân viên
* Theo dõi doanh thu
* Theo dõi tồn kho

### 2. Phân hệ Khách hàng (Frontend ReactJS)

Cho phép khách hàng:

* Đăng ký tài khoản
* Đăng nhập hệ thống
* Xem danh sách sản phẩm
* Tìm kiếm sản phẩm
* Xem chi tiết sản phẩm
* Thêm sản phẩm vào giỏ hàng
* Đặt hàng trực tuyến
* Xem lịch sử đơn hàng
* Đổi mật khẩu

---

## Công nghệ sử dụng

### Backend

* ASP.NET Core Web API
* ASP.NET Core MVC
* Entity Framework Core
* SQL Server

### Frontend

* ReactJS
* React Router DOM
* Axios
* Bootstrap

---

## Hướng dẫn cài đặt

### Backend

Yêu cầu:

* .NET SDK 8.0
* SQL Server

Cấu hình chuỗi kết nối trong file:

```json
appsettings.json
```

Thực hiện Migration:

```bash
dotnet ef database update
```

Chạy ứng dụng:

```bash
dotnet run
```

Địa chỉ mặc định:

```text
https://localhost:7024
```

---

### Frontend

Di chuyển vào thư mục Frontend:

```bash
cd cms.frontend
```

Cài đặt thư viện:

```bash
npm install
```

Khởi chạy ứng dụng:

```bash
npm start
```

Địa chỉ mặc định:

```text
http://localhost:3000
```

---

## Chức năng chính

### Quản trị viên

* Đăng nhập hệ thống
* Quản lý danh mục sản phẩm
* Quản lý sản phẩm
* Quản lý khách hàng
* Quản lý đơn hàng
* Quản lý nhân viên
* Thống kê doanh thu theo thời gian
* Theo dõi số lượng tồn kho

### Khách hàng

* Đăng ký tài khoản
* Đăng nhập
* Xem danh sách sản phẩm
* Tìm kiếm sản phẩm
* Xem chi tiết sản phẩm
* Thêm vào giỏ hàng
* Đặt hàng
* Theo dõi đơn hàng
* Đổi mật khẩu

---

## Cấu trúc dự án

```text
CMS.Backend
│
├── Controllers
├── Models
├── Data
├── Services
└── Migrations

CMS.Frontend
│
├── Pages
├── Components
├── Services
├── Routes
└── Assets
```

