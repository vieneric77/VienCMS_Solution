using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerOrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CustomerOrdersApiController(ApplicationDbContext context) => _context = context;
        [HttpGet("history/{customerId}")]
        public async Task<IActionResult> GetOrderHistory(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product) 
                .OrderByDescending(o => o.Id)  
                .Select(o => new {
                    o.Id,
                    o.Status, 
                    o.Notes,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.UnitPrice), 
                    Items = o.OrderDetails.Select(od => new {
                        od.ProductId,
                        ProductName = od.Product.Name,
                        od.Quantity,
                        od.UnitPrice
                    })
                })
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return Ok(new { message = "Bạn chưa có lịch sử đặt mua đơn hàng nào!", data = orders });
            }

            return Ok(orders);
        }
    }
}