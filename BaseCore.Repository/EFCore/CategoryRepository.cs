using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;

namespace BaseCore.Repository.EFCore
{
    /// <summary>
    /// Category Repository using Entity Framework Core
    /// </summary>
    public interface ICategoryRepositoryEF : IRepository<Category>
    {
        Task<Category?> GetByNameAsync(string name);
        Task<(List<Category> Categories, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    }

    public class CategoryRepositoryEF : Repository<Category>, ICategoryRepositoryEF
    {
        public CategoryRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<Category?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());
        }

        public async Task<(List<Category> Categories, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim().ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(normalizedKeyword) ||
                    (c.Description != null && c.Description.ToLower().Contains(normalizedKeyword)));
            }

            var totalCount = await query.CountAsync();
            var categories = await query
                .OrderBy(c => c.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (categories, totalCount);
        }
    }
}