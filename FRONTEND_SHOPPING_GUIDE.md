# Hướng Dẫn Chức Năng Mua Hàng - Frontend

## 🛍️ Tính Năng Đã Triển Khai

### 1. **Cửa Hàng (Shop Page)**
**URL:** `/shop`

Người dùng có thể:
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm sản phẩm theo:
  - Từ khóa (tên/loại)
  - Danh mục
  - Loại sản phẩm
  - Thương hiệu
  - Màu sắc
  - Kích thước
  - Khoảng giá
  - Trạng thái tồn kho
- ✅ Xem thông tin chi tiết sản phẩm
- ✅ **Thêm sản phẩm vào giỏ hàng** 🎯

**Giao diện:**
- Header: 
  - 🛒 Nút "Giỏ hàng" (hiển thị số lượng sản phẩm)
  - 📋 Nút "Đơn hàng của tôi"
  - ⚙️ Nút "Quản trị"
- Product Cards:
  - Hiển thị ảnh sản phẩm
  - Tên, loại, thương hiệu, màu, kích thước
  - Giá bán
  - Tình trạng tồn kho
  - **🛒 Nút "Thêm vào giỏ"** (disabled nếu hết hàng)

---

### 2. **Giỏ Hàng (Shopping Cart Modal)**

**Cách mở:**
- Click vào nút "🛒 Giỏ hàng" ở header

**Chức năng:**
- ✅ Xem danh sách sản phẩm trong giỏ
- ✅ Thay đổi số lượng (−/+)
- ✅ Xóa sản phẩm (🗑️)
- ✅ Xóa tất cả sản phẩm
- ✅ Nhập địa chỉ giao hàng
- ✅ **Đặt hàng** (Checkout)

**Quy trình Checkout:**
1. Kiểm tra địa chỉ giao hàng (bắt buộc)
2. Kiểm tra tồn kho của sản phẩm
3. Tính toán tổng tiền (tự động)
4. Gửi request tạo Order lên server
5. Nếu thành công:
   - Hiển thị thông báo "Đặt hàng thành công"
   - Xóa giỏ hàng
   - Tự động đóng modal sau 2 giây
6. Nếu lỗi:
   - Hiển thị thông báo lỗi chi tiết

**Giao diện giỏ hàng:**
```
┌─────────────────────────────────────┐
│ 🛒 Giỏ Hàng (3 sản phẩm)       [✕] │
├─────────────────────────────────────┤
│ [Ảnh] Sản phẩm 1           1000₫   │
│        −  [1]  +    1000₫   [🗑️]   │
│                                     │
│ [Ảnh] Sản phẩm 2           2000₫   │
│        −  [1]  +    2000₫   [🗑️]   │
├─────────────────────────────────────┤
│ Địa chỉ giao hàng:                  │
│ [________________]                  │
│                                     │
│ Tạm tính:        6000₫             │
│ Phí vận chuyển:  Miễn phí           │
│ Tổng cộng:       6000₫             │
│                                     │
│ [Xóa tất cả] [✓ Đặt hàng]          │
└─────────────────────────────────────┘
```

---

### 3. **Đơn Hàng Của Tôi (My Orders Page)**
**URL:** `/my-orders`

**Chức năng:**
- ✅ Xem danh sách các đơn hàng của người dùng
- ✅ Lọc/Tìm kiếm (làm mới)
- ✅ Xem chi tiết từng đơn hàng
- ✅ Hủy đơn hàng (nếu còn Pending hoặc Processing)

**Trạng thái Đơn Hàng:**
- ⏳ **Pending** - Chờ xử lý (có thể hủy)
- 🔄 **Processing** - Đang chuẩn bị (có thể hủy)
- 📦 **Shipped** - Đang giao (không thể hủy)
- ✓ **Completed** - Hoàn tất (không thể hủy)
- ✕ **Cancelled** - Đã hủy (không thể sửa)

**Danh sách Đơn Hàng:**
```
┌─────────────────────────────────────┐
│ 📋 Đơn Hàng Của Tôi    [🔄 Làm mới]│
├─────────────────────────────────────┤
│ Đơn hàng #1                  [⏳ Chờ]│
│ 📅 24/04/2024                       │
│ Địa chỉ: 123 Main St                │
│ Tổng tiền: 150,000 ₫               │
│ • 2x Sản phẩm 1                     │
│ • 1x Sản phẩm 2                     │
│ [👁 Chi tiết] [✕ Hủy đơn]          │
├─────────────────────────────────────┤
│ Đơn hàng #2               [✓ Hoàn tất]│
│ ...                                 │
└─────────────────────────────────────┘
```

**Modal Chi Tiết Đơn Hàng:**
```
┌─────────────────────────────────────┐
│ Chi Tiết Đơn Hàng #1          [✕]  │
├─────────────────────────────────────┤
│ Ngày đặt: 24/04/2024 10:30:00      │
│ Trạng thái: ⏳ Chờ xử lý             │
│ Địa chỉ: 123 Main St                │
│                                     │
│ Sản phẩm:                           │
│ ┌────────────────────────────────┐ │
│ │ Sản phẩm  │ SL │ Đơn giá │ Tổng│ │
│ │ SP 1      │ 2  │ 50,000  │100K│ │
│ │ SP 2      │ 1  │ 50,000  │50K │ │
│ └────────────────────────────────┘ │
│                                     │
│ Tạm tính:      150,000 ₫           │
│ Phí vận chuyển: Miễn phí             │
│ Tổng cộng:     150,000 ₫           │
│                                     │
│ [✕ Hủy đơn hàng] [Đóng]            │
└─────────────────────────────────────┘
```

---

## 🔑 Các Component React Tạo Mới

### 1. **CartContext.jsx**
- `useCart()` hook
- Actions: addToCart, removeFromCart, updateQuantity, clearCart
- Selectors: getTotalPrice, getTotalItems

### 2. **ShoppingCart.jsx**
- Modal component cho giỏ hàng
- Props: `isOpen`, `onClose`
- Tích hợp với API để tạo order

### 3. **MyOrders.jsx**
- Page component để xem đơn hàng
- Hiển thị danh sách đơn hàng
- Modal xem chi tiết
- Chức năng hủy đơn hàng

---

## 📱 API Integration

### Endpoints Sử Dụng:
```
POST   /api/orders                 - Tạo đơn hàng
GET    /api/orders/my-orders       - Lấy đơn hàng của tôi
GET    /api/orders/{id}            - Chi tiết đơn hàng
POST   /api/orders/{id}/cancel     - Hủy đơn hàng
```

### Request Examples:

**1. Tạo Đơn Hàng:**
```javascript
POST /api/orders
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ],
  "shippingAddress": "123 Main Street, City"
}
```

**2. Lấy Đơn Hàng:**
```javascript
GET /api/orders/my-orders
```

**3. Hủy Đơn Hàng:**
```javascript
POST /api/orders/{orderId}/cancel
```

---

## 💾 Local Storage

- **token** - JWT token
- **user** - Thông tin người dùng
- Giỏ hàng được lưu trong **React Context** (tạm thời, mất khi reload)

---

## 🔒 Authentication

- Tất cả các endpoint yêu cầu JWT token
- Token được lấy từ localStorage
- Nếu token hết hạn → redirect về login

---

## 🎨 Styling

Sử dụng:
- **Bootstrap** cho layout chính
- **Custom CSS** cho Shopping Cart và My Orders
- Emoji icons cho UX tốt hơn

---

## 🚀 Cách Sử Dụng

### 1. **Đặt Hàng:**
1. Đăng nhập hoặc truy cập `/shop`
2. Tìm kiếm/duyệt sản phẩm
3. Click "🛒 Thêm vào giỏ"
4. Click "🛒 Giỏ hàng" ở header
5. Nhập địa chỉ giao hàng
6. Click "✓ Đặt hàng"
7. Xác nhận thành công ✓

### 2. **Xem Đơn Hàng:**
1. Click "📋 Đơn hàng của tôi" ở Shop hoặc Menu
2. Xem danh sách đơn hàng
3. Click "👁 Chi tiết" để xem full info
4. (Tùy chọn) Click "✕ Hủy đơn" nếu chưa giao

---

## ⚠️ Lưu Ý

- **Tồn kho**: Kiểm tra tự động khi thêm vào giỏ và khi checkout
- **Hủy đơn**: Chỉ hủy được nếu trạng thái là Pending hoặc Processing
- **Hủy Order**: Tự động hoàn lại stock sản phẩm
- **Phí vận chuyển**: Miễn phí (có thể cấu hình sau)

---

## 📊 Dữ Liệu Flow

```
User Input → CartContext → ShoppingCart Modal → API → Order Created
    ↓
Server Response → Giỏ Hàng → MyOrders Page
    ↓
Xem Chi Tiết / Hủy Đơn
```

---

## 🐛 Troubleshooting

| Vấn Đề | Giải Pháp |
|--------|----------|
| Token hết hạn | Đăng nhập lại |
| Lỗi "Tồn kho không đủ" | Giảm số lượng sản phẩm |
| Không thể hủy đơn | Kiểm tra trạng thái (phải là Pending/Processing) |
| Giỏ hàng trống sau reload | Bình thường - Cart lưu trong Context tạm thời |
| API error 401 | Token không hợp lệ, đăng nhập lại |

---

**Happy Shopping! 🛍️**
