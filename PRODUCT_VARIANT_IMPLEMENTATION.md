# Product Variant System Implementation

## Tổng quan
Hệ thống Product Variant đã được implement để tự động tạo variants thay vì products trùng lặp khi tên product (sau khi normalize) đã tồn tại trong database.

## Tính năng chính

### 1. Tự động tạo Variant
- Khi người dùng tạo product với tên đã tồn tại (ignore case, trim spaces), hệ thống sẽ tạo variant mới thay vì product mới
- Ví dụ: "Áo Sơ Mi" màu đỏ đã tồn tại → tạo "áo sơ mi" màu xanh → hệ thống tạo variant màu xanh cho product "Áo Sơ Mi"

### 2. Normalize Product Name  
- Function `NormalizeProductName()` để chuẩn hóa tên: trim space, uppercase
- So sánh tên product không phân biệt hoa thường và khoảng trắng

### 3. Auto Stock Accumulation (Updated Feature)
- Khi tạo variant đã tồn tại, hệ thống tự động cộng dồn số lượng thay vì báo lỗi
- Ví dụ: Có 10 áo ABC màu đỏ → thêm 5 áo ABC màu đỏ → tự động cập nhật thành 15 áo
- User-friendly: Không bị reject khi nhập thêm stock cho variant đã có
- Automatic inventory management: Phù hợp với workflow thực tế của shop

## Database Changes

### Bảng mới: ProductVariants
```sql
CREATE TABLE ProductVariants (
    VariantID int IDENTITY(1,1) PRIMARY KEY,
    ProductID int NOT NULL,
    VariantName nvarchar(255),
    VariantType nvarchar(100) NOT NULL,  -- Ví dụ: "Color", "Size"
    VariantValue nvarchar(100) NOT NULL, -- Ví dụ: "Đỏ", "XL"
    AdditionalPrice decimal(10,2) DEFAULT 0,
    StockQuantity int DEFAULT 0,
    VariantSKU nvarchar(100),
    IsActive bit DEFAULT 1,
    CreatedDate datetime DEFAULT GETDATE(),
    ModifiedDate datetime,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductId)
);
```

### Bảng Products - Thêm columns:
- `IsMainProduct bit DEFAULT 1` - Đánh dấu product chính (không phải variant)
- `ProductGroup nvarchar(255)` - Nhóm sản phẩm (tên đã normalize)

### Stored Procedures:
- `FindProductByName(@ProductName)` - Tìm product theo tên normalized
- `GetProductVariants(@ProductId)` - Lấy tất cả variants của product
- `NormalizeProductName(@ProductName)` - Function normalize tên

## API Endpoints

### Existing Endpoints (Updated):
- `POST /api/products` - Tạo product mới hoặc variant (tự động detect)

### New Endpoints:
- `GET /api/products/{id}/variants` - Lấy tất cả variants của product
- `POST /api/products/{id}/variants` - Tạo variant mới cho product

## Backend Implementation

### DTOs mới:
- `ProductVariantDto` - Response DTO cho variant
- `CreateProductVariantDto` - Request DTO để tạo variant
- `ProductWithVariantsDto` - Product kèm danh sách variants

### CreateProductDto - Thêm fields:
```csharp
public string? VariantType { get; set; }        // "Color", "Size", etc.
public string? VariantValue { get; set; }       // "Đỏ", "XL", etc.
public decimal? VariantAdditionalPrice { get; set; }
public int? VariantStockQuantity { get; set; }
public string? VariantSKU { get; set; }
```

### Services:
- `ProductService.CreateProductAsync()` - Logic detect và tạo variant/product
- `ProductService.GetProductVariantsAsync()` - Lấy variants
- `ProductService.CreateProductVariantAsync()` - Tạo variant mới

### Repositories:
- `IProductVariantRepository` + `ProductVariantRepository`
- Update `IUnitOfWork` để include ProductVariantRepository

## Test Scenarios

### Test Case 1: Tạo product đầu tiên
```json
POST /api/products
{
  "name": "Áo Sơ Mi",
  "variantType": "Color",
  "variantValue": "Đỏ",
  "price": 100000,
  "unitInStock": 50
}
```
→ Tạo product mới + variant đầu tiên

### Test Case 2: Tạo variant cho product existing
```json
POST /api/products
{
  "name": "áo sơ mi",  // Normalize sẽ thành "ÁO SƠ MI"
  "variantType": "Color", 
  "variantValue": "Xanh",
  "price": 100000,
  "variantAdditionalPrice": 5000,
  "variantStockQuantity": 30
}
```
→ Tạo variant mới cho product "Áo Sơ Mi"

### Test Case 3: Auto stock accumulation for existing variant
```json
POST /api/products  
{
  "name": "Áo Sơ Mi",
  "variantType": "Color",
  "variantValue": "Đỏ",  // Đã tồn tại với 10 chiếc
  "variantStockQuantity": 5
}
```
→ Tự động cộng dồn: 10 + 5 = 15 chiếc cho variant màu đỏ

### Test Case 4: Product mới (tên khác)
```json
POST /api/products
{
  "name": "Áo Polo",
  "variantType": "Color", 
  "variantValue": "Đỏ"
}
```
→ Tạo product mới vì tên "Áo Polo" chưa tồn tại

## Migration Instructions

1. **Backup database** trước khi chạy migration
2. Chạy script `product_variants_migration.sql`
3. Build và deploy backend code
4. Test với script `test_product_variants.sql`

## Frontend Integration (Optional)

Frontend có thể:
- Hiển thị dropdown/selector cho variants (màu, size, etc.)
- Call API `GET /api/products/{id}/variants` để load variants
- Update product creation form để support variant info
- Hiển thị stock và price cho từng variant

## Expected Results

Sau khi implement:
1. ✅ Không tạo duplicate products với tên giống nhau
2. ✅ Tự động group variants theo product chính  
3. ✅ API consistent - vẫn dùng POST /api/products
4. ✅ Database normalized và scalable
5. ✅ Support multiple variant types (Color, Size, etc.)

## Notes

- Hệ thống backward compatible - existing products không bị ảnh hưởng
- Performance: Index trên ProductGroup column để tăng tốc lookup
- Extensible: Dễ dàng thêm variant types mới
- Admin có thể manage variants qua dedicated endpoints
