# Hướng Dẫn Chạy Frontend

Hướng dẫn này giúp bạn cài đặt và chạy ứng dụng frontend một cách đơn giản.

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js** phiên bản 18.0.0 trở lên
- **npm** (thường đi kèm với Node.js) hoặc **yarn**

Để kiểm tra phiên bản, chạy lệnh:
```bash
node --version
npm --version
```

Nếu chưa cài đặt, tải về tại: [https://nodejs.org/](https://nodejs.org/)

## 🚀 Các Bước Chạy Frontend

### Bước 1: Di chuyển vào thư mục frontend

```bash
cd frontend
```

### Bước 2: Cài đặt các thư viện cần thiết

```bash
npm install
```

Lệnh này sẽ tải về và cài đặt tất cả các package được liệt kê trong `package.json`. Quá trình này có thể mất vài phút tùy thuộc vào tốc độ internet.

### Bước 3: Chạy ứng dụng ở chế độ development

```bash
npm run dev
```

Sau khi chạy lệnh, bạn sẽ thấy thông báo tương tự:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Bước 4: Mở trình duyệt

Mở trình duyệt và truy cập địa chỉ: **http://localhost:5173**

Ứng dụng sẽ tự động reload khi bạn thay đổi code.

## 📦 Các Lệnh Khác

### Build ứng dụng cho production

```bash
npm run build
```

Lệnh này sẽ tạo thư mục `dist` chứa các file đã được tối ưu hóa để deploy.

### Xem preview của bản build

```bash
npm run preview
```

### Kiểm tra lỗi code (linting)

```bash
npm run lint
```

## ⚠️ Lưu Ý

1. **Backend không bắt buộc**: Frontend có thể chạy độc lập. Tuy nhiên, một số tính năng cần kết nối với backend API có thể không hoạt động nếu backend chưa được cài đặt.

2. **Proxy API**: Nếu bạn muốn kết nối với backend, đảm bảo backend đang chạy tại `http://localhost:8000` hoặc cấu hình biến môi trường `VITE_BACKEND_URL` trong file `.env`.

3. **Port đã được sử dụng**: Nếu port 5173 đã được sử dụng, Vite sẽ tự động chọn port khác (5174, 5175, ...).

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Cannot find module"
```bash
# Xóa node_modules và cài đặt lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port already in use"
- Đóng các ứng dụng đang sử dụng port 5173
- Hoặc chỉ định port khác: `npm run dev -- --port 3000`

### Lỗi: "EACCES permission denied"
- Trên Linux/Mac: Thử dùng `sudo` (không khuyến khích)
- Hoặc cài đặt Node.js bằng nvm để tránh vấn đề quyền

## 📁 Cấu Trúc Thư Mục

```
frontend/
├── src/              # Mã nguồn chính
│   ├── components/   # Các component React
│   ├── pages/        # Các trang
│   ├── assets/       # Hình ảnh, video, etc.
│   └── styles/       # File CSS
├── public/           # File tĩnh
├── dist/             # Build output (sau khi chạy npm run build)
├── package.json      # Dependencies và scripts
└── vite.config.js    # Cấu hình Vite
```

## 💡 Mẹo Hữu Ích

- Sử dụng **Ctrl + C** trong terminal để dừng server development
- Giữ terminal mở trong khi đang phát triển để xem logs và lỗi
- Sử dụng DevTools của trình duyệt (F12) để debug

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Phiên bản Node.js có đúng yêu cầu không
2. Đã chạy `npm install` chưa
3. Có lỗi nào trong terminal không
