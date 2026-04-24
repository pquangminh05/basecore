using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BillsController : ControllerBase
    {
        private readonly IOrderRepositoryEF _orderRepository;
        private readonly IOrderDetailRepositoryEF _orderDetailRepository;

        public BillsController(IOrderRepositoryEF orderRepository, IOrderDetailRepositoryEF orderDetailRepository)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            var (items, totalCount) = await _orderRepository.SearchAsync(status, page, pageSize);
            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var bill = await _orderRepository.GetByIdAsync(id);
            if (bill == null) return NotFound(new { message = "Bill not found" });

            var details = await _orderDetailRepository.GetByOrderAsync(id);
            var billDetails = details.Select(d => new
            {
                d.Id,
                Id_product = d.ProductId,
                Id_bill = d.OrderId,
                d.Quantity,
                Price = d.UnitPrice,
                d.Product
            });

            return Ok(new { bill, details = billDetails });
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBillStatusDto dto)
        {
            var bill = await _orderRepository.GetByIdAsync(id);
            if (bill == null) return NotFound(new { message = "Bill not found" });

            bill.Status = dto.Status;
            await _orderRepository.UpdateAsync(bill);
            return Ok(bill);
        }
    }

    public class UpdateBillStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
