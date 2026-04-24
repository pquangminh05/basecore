using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;

namespace BaseCore.Repository.EFCore
{
    /// <summary>
    /// Product Repository using Entity Framework Core
    /// </summary>
    public interface IProductRepositoryEF : IRepository<Product>
    {
        Task<(List<Product> Products, int TotalCount)> SearchAsync(
            string? keyword,
            int? categoryId,
            int? productTypeId,
            int? manufacturerId,
            int? colorId,
            int? sizeId,
            decimal? minPrice,
            decimal? maxPrice,
            bool? inStock,
            int page,
            int pageSize);
        Task<List<Product>> GetByCategoryAsync(int categoryId);
    }

    public class ProductRepositoryEF : Repository<Product>, IProductRepositoryEF
    {
        public ProductRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<(List<Product> Products, int TotalCount)> SearchAsync(
            string? keyword,
            int? categoryId,
            int? productTypeId,
            int? manufacturerId,
            int? colorId,
            int? sizeId,
            decimal? minPrice,
            decimal? maxPrice,
            bool? inStock,
            int page,
            int pageSize)
        {
            var query = _dbSet
                .Include(p => p.Category)
                .Include(p => p.ProductType)
                .Include(p => p.Manufacturer)
                .Include(p => p.Color)
                .Include(p => p.Size)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(keyword) ||
                    (p.Category != null && p.Category.Name.ToLower().Contains(keyword)) ||
                    (p.Description != null && p.Description.ToLower().Contains(keyword)));
            }

            if (categoryId.HasValue && categoryId > 0)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            if (productTypeId.HasValue && productTypeId > 0)
            {
                query = query.Where(p => p.ProductTypeId == productTypeId);
            }

            if (manufacturerId.HasValue && manufacturerId > 0)
            {
                query = query.Where(p => p.ManufacturerId == manufacturerId);
            }

            if (colorId.HasValue && colorId > 0)
            {
                query = query.Where(p => p.ColorId == colorId);
            }

            if (sizeId.HasValue && sizeId > 0)
            {
                query = query.Where(p => p.SizeId == sizeId);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (inStock.HasValue)
            {
                query = inStock.Value
                    ? query.Where(p => p.Stock > 0)
                    : query.Where(p => p.Stock <= 0);
            }

            var totalCount = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products, totalCount);
        }

        public async Task<List<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _dbSet
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .Include(p => p.ProductType)
                .Include(p => p.Manufacturer)
                .Include(p => p.Color)
                .Include(p => p.Size)
                .ToListAsync();
        }
    }
}
