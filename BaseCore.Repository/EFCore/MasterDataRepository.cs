using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;

namespace BaseCore.Repository.EFCore
{
    public interface IManufacturerRepositoryEF : IRepository<Manufacturer>
    {
        Task<Manufacturer?> GetByNameAsync(string name);
        Task<(List<Manufacturer> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    }

    public interface IProductTypeRepositoryEF : IRepository<ProductType>
    {
        Task<ProductType?> GetByNameAsync(string name);
        Task<(List<ProductType> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    }

    public interface IProductColorRepositoryEF : IRepository<ProductColor>
    {
        Task<ProductColor?> GetByNameAsync(string name);
        Task<(List<ProductColor> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    }

    public interface IProductSizeRepositoryEF : IRepository<ProductSize>
    {
        Task<ProductSize?> GetByNameAsync(string name);
        Task<(List<ProductSize> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    }

    public class ManufacturerRepositoryEF : Repository<Manufacturer>, IManufacturerRepositoryEF
    {
        public ManufacturerRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<Manufacturer?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
        }

        public async Task<(List<Manufacturer> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _dbSet.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim().ToLower();
                query = query.Where(x =>
                    x.Name.ToLower().Contains(normalizedKeyword) ||
                    x.Description.ToLower().Contains(normalizedKeyword));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }
    }

    public class ProductTypeRepositoryEF : Repository<ProductType>, IProductTypeRepositoryEF
    {
        public ProductTypeRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<ProductType?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
        }

        public async Task<(List<ProductType> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _dbSet.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim().ToLower();
                query = query.Where(x =>
                    x.Name.ToLower().Contains(normalizedKeyword) ||
                    x.Description.ToLower().Contains(normalizedKeyword));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }
    }

    public class ProductColorRepositoryEF : Repository<ProductColor>, IProductColorRepositoryEF
    {
        public ProductColorRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<ProductColor?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
        }

        public async Task<(List<ProductColor> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _dbSet.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim().ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(normalizedKeyword));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }
    }

    public class ProductSizeRepositoryEF : Repository<ProductSize>, IProductSizeRepositoryEF
    {
        public ProductSizeRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<ProductSize?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
        }

        public async Task<(List<ProductSize> Items, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _dbSet.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim().ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(normalizedKeyword));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalCount);
        }
    }
}
