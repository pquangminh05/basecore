using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/master-data")]
    [ApiController]
    public class MasterDataController : ControllerBase
    {
        private readonly IManufacturerRepositoryEF _manufacturerRepository;
        private readonly IProductTypeRepositoryEF _productTypeRepository;
        private readonly IProductColorRepositoryEF _productColorRepository;
        private readonly IProductSizeRepositoryEF _productSizeRepository;

        public MasterDataController(
            IManufacturerRepositoryEF manufacturerRepository,
            IProductTypeRepositoryEF productTypeRepository,
            IProductColorRepositoryEF productColorRepository,
            IProductSizeRepositoryEF productSizeRepository)
        {
            _manufacturerRepository = manufacturerRepository;
            _productTypeRepository = productTypeRepository;
            _productColorRepository = productColorRepository;
            _productSizeRepository = productSizeRepository;
        }

        [HttpGet("options")]
        public async Task<IActionResult> GetOptions()
        {
            var manufacturers = await _manufacturerRepository.GetAllAsync();
            var productTypes = await _productTypeRepository.GetAllAsync();
            var colors = await _productColorRepository.GetAllAsync();
            var sizes = await _productSizeRepository.GetAllAsync();

            return Ok(new
            {
                manufacturers,
                productTypes,
                colors,
                sizes
            });
        }

        [HttpGet("manufacturers")]
        public async Task<IActionResult> GetManufacturers([FromQuery] string? keyword, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var (items, totalCount) = await _manufacturerRepository.SearchAsync(keyword, page, pageSize);
            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpPost("manufacturers")]
        [Authorize]
        public async Task<IActionResult> CreateManufacturer([FromBody] NameDescriptionDto dto)
        {
            var existing = await _manufacturerRepository.GetByNameAsync(dto.Name);
            if (existing != null) return BadRequest(new { message = "Manufacturer already exists" });

            var entity = new Manufacturer
            {
                Name = dto.Name,
                Description = dto.Description ?? string.Empty
            };
            await _manufacturerRepository.AddAsync(entity);
            return Ok(entity);
        }

        [HttpPut("manufacturers/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateManufacturer(int id, [FromBody] NameDescriptionDto dto)
        {
            var entity = await _manufacturerRepository.GetByIdAsync(id);
            if (entity == null) return NotFound(new { message = "Manufacturer not found" });

            entity.Name = string.IsNullOrWhiteSpace(dto.Name) ? entity.Name : dto.Name;
            entity.Description = dto.Description ?? entity.Description;
            await _manufacturerRepository.UpdateAsync(entity);
            return Ok(entity);
        }

        [HttpDelete("manufacturers/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteManufacturer(int id)
        {
            var entity = await _manufacturerRepository.GetByIdAsync(id);
            if (entity == null) return NotFound(new { message = "Manufacturer not found" });

            await _manufacturerRepository.DeleteAsync(entity);
            return Ok(new { message = "Deleted successfully" });
        }
    }

    public class NameDescriptionDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
