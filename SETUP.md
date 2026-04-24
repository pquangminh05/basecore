# BaseCore Setup Notes

## 1) Cau hinh ket noi Database o dau?

- API service doc connection string tai:
  - `C:\Users\ADMIN\Documents\Codex\2026-04-23-xin-ch-o\FW\BaseCore\BaseCore.APIService\appsettings.json`
- Key dang duoc dung:
  - `ConnectionStrings:MySQL`
- Cho moi truong Development, ban co the tao them:
  - `appsettings.Development.json` trong cung thu muc `BaseCore.APIService`

- Auth service dung MySQL user table va doc connection string tai:
  - `C:\Users\ADMIN\Documents\Codex\2026-04-23-xin-ch-o\FW\BaseCore\BaseCore.AuthService\appsettings.json`
  - key: `ConnectionStrings:MySQL`

Trong `Program.cs`, phan dang doc connection string:
- `C:\Users\ADMIN\Documents\Codex\2026-04-23-xin-ch-o\FW\BaseCore\BaseCore.APIService\Program.cs`
- Dong: `options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));`

## 2) Cong dich vu khi chay local

- API Gateway: `http://localhost:5000`
- API Service (Products/Categories/Orders/Bills): `http://localhost:5001`
- Auth Service: `http://localhost:5002`
- WebClient (Vite): `http://localhost:3000`

## 3) Script DB mo rong

File script:
- `C:\Users\ADMIN\Documents\Codex\2026-04-23-xin-ch-o\FW\BaseCore\database\basecore_sales_extended.sql`

Script nay bo sung:
- `producttypes`, `manufacturers`, `productcolors`, `productsizes`
- Cot FK moi trong `products`:
  - `ProductTypeId`, `ManufacturerId`, `ColorId`, `SizeId`

Neu DB cua ban dang co seed cu (Laptop/Phone...), chay them:
- `C:\Users\ADMIN\Documents\Codex\2026-04-23-xin-ch-o\FW\BaseCore\database\watch_theme_seed_update.sql`
