# Hồ sơ năng lực: Lê Quốc Đạt

Static site (HTML + CSS + JS), không cần build.

## Chạy thử

```bash
python3 -m http.server 5173
```

Mở http://localhost:5173

## Cấu trúc

- `index.html`: toàn bộ nội dung (sửa chữ trực tiếp ở đây)
- `styles.css`: design tokens (màu, font, bo góc) ở đầu file
- `main.js`: theme sáng/tối, hiệu ứng, form liên hệ, mảng `TESTIMONIALS`
- `cv.pdf`: file được nút "Tải CV" tải về
- `assets/avatar.jpg`: ảnh chân dung (4:5, tối thiểu 960x1200). Khi chưa có ảnh, web hiện monogram "QD"
- `assets/og-cover.jpg`: ảnh xem trước khi chia sẻ link (1200x630)

## Deploy

- **Vercel / Netlify:** kéo thả thư mục này, hoặc kết nối repo GitHub.
- **GitHub Pages:** push lên repo, bật Pages ở nhánh `main`.
