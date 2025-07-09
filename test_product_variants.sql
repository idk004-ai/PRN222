-- Test Script để kiểm tra Product Variant System
-- Chạy script này sau khi đã apply product_variants_migration.sql

-- Kiểm tra bảng Products và ProductVariants đã được tạo
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('Products', 'ProductVariants');

-- Test 1: Tạo sản phẩm đầu tiên với tên "Áo Sơ Mi"
-- (Tương đương với API call: POST /api/products với Name="Áo Sơ Mi", VariantType="Color", VariantValue="Đỏ")

-- Test 2: Kiểm tra function NormalizeProductName
SELECT dbo.NormalizeProductName('  Áo Sơ Mi  ') as NormalizedName;
SELECT dbo.NormalizeProductName('ÁO SƠ MI') as NormalizedName;
SELECT dbo.NormalizeProductName('áo sơ mi') as NormalizedName;

-- Test 3: Kiểm tra stored procedure FindProductByName
EXEC FindProductByName 'Áo Sơ Mi';

-- Test 4: Kiểm tra stored procedure GetProductVariants (sau khi có data)
-- EXEC GetProductVariants @ProductId = 1;

-- Test 5: Kiểm tra data sau khi tạo products qua API
/*
Kịch bản test:
1. Tạo product "Áo Sơ Mi" màu Đỏ với 10 chiếc
2. Tạo product "Áo Sơ Mi" màu Xanh với 15 chiếc (sẽ tạo variant thay vì product mới)
3. Tạo product "Áo Polo" màu Đỏ với 20 chiếc (sẽ tạo product mới vì tên khác)
4. Tạo product "áo sơ mi" màu Vàng với 25 chiếc (sẽ tạo variant cho "Áo Sơ Mi" vì normalize giống nhau)
5. Tạo product "Áo Sơ Mi" màu Đỏ với 5 chiếc LẦN 2 (sẽ cộng dồn: 10 + 5 = 15 chiếc)

Expected results:
- 2 products: "Áo Sơ Mi" (IsMainProduct=1) và "Áo Polo" (IsMainProduct=1)
- 4 variants: Đỏ (15), Xanh (15), Vàng (25) cho "Áo Sơ Mi" và 1 variant Đỏ (20) cho "Áo Polo"
- Stock của "Áo Sơ Mi" màu Đỏ được cập nhật từ 10 → 15 thay vì tạo duplicate
*/

-- Query để xem kết quả test
SELECT 
    p.ProductId,
    p.Name as ProductName,
    p.IsMainProduct,
    p.ProductGroup,
    COUNT(pv.VariantID) as VariantCount
FROM Products p
LEFT JOIN ProductVariants pv ON p.ProductId = pv.ProductID
GROUP BY p.ProductId, p.Name, p.IsMainProduct, p.ProductGroup
ORDER BY p.ProductId;

-- Query để xem chi tiết variants
SELECT 
    p.Name as ProductName,
    pv.VariantType,
    pv.VariantValue,
    pv.VariantName,
    pv.AdditionalPrice,
    pv.StockQuantity,
    pv.IsActive
FROM Products p
INNER JOIN ProductVariants pv ON p.ProductId = pv.ProductID
ORDER BY p.Name, pv.VariantType, pv.VariantValue;
