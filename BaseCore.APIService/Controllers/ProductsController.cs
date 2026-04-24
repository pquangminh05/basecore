using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BaseCore.Entities;
using BaseCore.Repository.EFCore;

namespace BaseCore.APIService.Controllers
{
    /// <summary>
    /// Product API Controller
    /// Teaching: RESTful API, CRUD Operations, EF Core (Bài 10, 11)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepositoryEF _productRepository;
        private readonly ICategoryRepositoryEF _categoryRepository;
        private readonly IProductTypeRepositoryEF _productTypeRepository;
        private readonly IManufacturerRepositoryEF _manufacturerRepository;
        private readonly IProductColorRepositoryEF _productColorRepository;
        private readonly IProductSizeRepositoryEF _productSizeRepository;

        public ProductsController(
            IProductRepositoryEF productRepository,
            ICategoryRepositoryEF categoryRepository,
            IProductTypeRepositoryEF productTypeRepository,
            IManufacturerRepositoryEF manufacturerRepository,
            IProductColorRepositoryEF productColorRepository,
            IProductSizeRepositoryEF productSizeRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _productTypeRepository = productTypeRepository;
            _manufacturerRepository = manufacturerRepository;
            _productColorRepository = productColorRepository;
            _productSizeRepository = productSizeRepository;
        }

        /// <summary>
        /// Get all products with pagination and search
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int? categoryId,
            [FromQuery] int? productTypeId,
            [FromQuery] int? manufacturerId,
            [FromQuery] int? colorId,
            [FromQuery] int? sizeId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] bool? inStock,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var (products, totalCount) = await _productRepository.SearchAsync(
                keyword,
                categoryId,
                productTypeId,
                manufacturerId,
                colorId,
                sizeId,
                minPrice,
                maxPrice,
                inStock,
                page,
                pageSize);

            return Ok(new
            {
                items = products,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        /// <summary>
        /// Get product by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        /// <summary>
        /// Create new product (requires authentication)
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
        {
            // Validate category exists
            var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
            if (category == null)
                return BadRequest(new { message = "Category not found" });

            if (dto.ProductTypeId.HasValue && await _productTypeRepository.GetByIdAsync(dto.ProductTypeId.Value) == null)
                return BadRequest(new { message = "Product type not found" });
            if (dto.ManufacturerId.HasValue && await _manufacturerRepository.GetByIdAsync(dto.ManufacturerId.Value) == null)
                return BadRequest(new { message = "Manufacturer not found" });
            if (dto.ColorId.HasValue && await _productColorRepository.GetByIdAsync(dto.ColorId.Value) == null)
                return BadRequest(new { message = "Color not found" });
            if (dto.SizeId.HasValue && await _productSizeRepository.GetByIdAsync(dto.SizeId.Value) == null)
                return BadRequest(new { message = "Size not found" });

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                ProductTypeId = dto.ProductTypeId,
                ManufacturerId = dto.ManufacturerId,
                ColorId = dto.ColorId,
                SizeId = dto.SizeId,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl ?? ""
            };

            await _productRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        /// <summary>
        /// Update product (requires authentication)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            product.Name = dto.Name ?? product.Name;
            product.Price = dto.Price ?? product.Price;
            product.Stock = dto.Stock ?? product.Stock;
            product.CategoryId = dto.CategoryId ?? product.CategoryId;
            product.ProductTypeId = dto.ProductTypeId ?? product.ProductTypeId;
            product.ManufacturerId = dto.ManufacturerId ?? product.ManufacturerId;
            product.ColorId = dto.ColorId ?? product.ColorId;
            product.SizeId = dto.SizeId ?? product.SizeId;
            product.Description = dto.Description ?? product.Description;
            product.ImageUrl = dto.ImageUrl ?? product.ImageUrl;

            await _productRepository.UpdateAsync(product);
            return Ok(product);
        }

        /// <summary>
        /// Delete product (requires authentication)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            await _productRepository.DeleteAsync(product);
            return Ok(new { message = "Product deleted successfully" });
        }

        /// <summary>
        /// Get products by category
        /// </summary>
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _productRepository.GetByCategoryAsync(categoryId);
            return Ok(products);
        }
    }

    // DTOs
    public class ProductCreateDto
    {
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? ManufacturerId { get; set; }
        public int? ColorId { get; set; }
        public int? SizeId { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? ManufacturerId { get; set; }
        public int? ColorId { get; set; }
        public int? SizeId { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
