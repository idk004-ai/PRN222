-- Migration script to add Product Variants functionality
-- This script adds support for product variants based on same product names

USE [Kahreedo]
GO

-- Create ProductVariants table to store variant information
CREATE TABLE [dbo].[ProductVariants](
    [VariantID] [int] IDENTITY(1,1) NOT NULL,
    [ProductID] [int] NOT NULL, -- Reference to the main Products table
    [VariantName] [varchar](100) NOT NULL, -- Name of the variant (e.g., "Red", "Large", "Cotton")
    [VariantType] [varchar](50) NOT NULL, -- Type of variant (e.g., "Color", "Size", "Material")
    [VariantValue] [varchar](200) NOT NULL, -- Value of the variant
    [AdditionalPrice] [decimal](18, 2) NULL DEFAULT 0, -- Additional price for this variant
    [StockQuantity] [int] NULL DEFAULT 0, -- Stock specific to this variant
    [VariantSKU] [varchar](50) NULL, -- SKU specific to this variant
    [IsActive] [bit] NOT NULL DEFAULT 1,
    [CreatedDate] [datetime] NOT NULL DEFAULT GETDATE(),
    [ModifiedDate] [datetime] NULL,
    
    CONSTRAINT [PK_ProductVariants] PRIMARY KEY CLUSTERED ([VariantID] ASC),
    CONSTRAINT [FK_ProductVariants_Products] FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Products]([ProductID]) ON DELETE CASCADE
)
GO

-- Create index for better performance
CREATE NONCLUSTERED INDEX [IX_ProductVariants_ProductID] ON [dbo].[ProductVariants]([ProductID])
GO

CREATE NONCLUSTERED INDEX [IX_ProductVariants_VariantType] ON [dbo].[ProductVariants]([VariantType])
GO

-- Add a column to Products table to mark if it's the main product for variants
ALTER TABLE [dbo].[Products] 
ADD [IsMainProduct] [bit] NOT NULL DEFAULT 1,
    [ProductGroup] [varchar](100) NULL -- Group name for variants (normalized product name)
GO

-- Create index for ProductGroup for faster lookups
CREATE NONCLUSTERED INDEX [IX_Products_ProductGroup] ON [dbo].[Products]([ProductGroup])
GO

-- Create a stored procedure to find existing product by name (case-insensitive, trimmed)
CREATE PROCEDURE [dbo].[FindProductByName]
    @ProductName NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NormalizedName NVARCHAR(50) = LTRIM(RTRIM(UPPER(@ProductName)))
    
    SELECT TOP 1 
        ProductID,
        Name,
        ProductGroup,
        IsMainProduct
    FROM Products 
    WHERE UPPER(LTRIM(RTRIM(Name))) = @NormalizedName
        AND IsMainProduct = 1
    ORDER BY ProductID ASC
END
GO

-- Create a stored procedure to get all variants of a product
CREATE PROCEDURE [dbo].[GetProductVariants]
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        v.VariantID,
        v.ProductID,
        v.VariantName,
        v.VariantType,
        v.VariantValue,
        v.AdditionalPrice,
        v.StockQuantity,
        v.VariantSKU,
        v.IsActive,
        v.CreatedDate,
        v.ModifiedDate,
        p.Name as ProductName,
        p.UnitPrice as BasePrice,
        (p.UnitPrice + ISNULL(v.AdditionalPrice, 0)) as TotalPrice
    FROM ProductVariants v
    INNER JOIN Products p ON v.ProductID = p.ProductID
    WHERE v.ProductID = @ProductID 
        AND v.IsActive = 1
    ORDER BY v.VariantType, v.VariantValue
END
GO

-- Create a function to normalize product name for grouping
CREATE FUNCTION [dbo].[NormalizeProductName](@ProductName NVARCHAR(50))
RETURNS NVARCHAR(50)
AS
BEGIN
    RETURN UPPER(LTRIM(RTRIM(@ProductName)))
END
GO

-- Update existing products to set ProductGroup
UPDATE Products 
SET ProductGroup = dbo.NormalizeProductName(Name)
WHERE ProductGroup IS NULL
GO

PRINT 'Product Variants functionality has been successfully added to the database.'
PRINT 'Tables created: ProductVariants'
PRINT 'Procedures created: FindProductByName, GetProductVariants'
PRINT 'Function created: NormalizeProductName'
PRINT 'Products table updated with IsMainProduct and ProductGroup columns'
