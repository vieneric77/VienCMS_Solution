using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API Lấy toàn bộ danh sách chi tiết đơn hàng đang có trên hệ thống
        [HttpGet]
        public IActionResult GetAll()
        {
            var details = _context.OrderDetails
                .ToList()
                .Select(od => new {
                    od.Id,
                    od.OrderId,
                    od.ProductId,
                    ProductName = _context.Products
                        .Where(p => p.Id == od.ProductId)
                        .Select(p => p.Name)
                        .FirstOrDefault() ?? "Sản phẩm đã bị xóa",
                    od.Quantity,
                    od.UnitPrice,
                    SubTotal = od.Quantity * od.UnitPrice
                })
                .ToList();

            return Ok(details);
        }

        // 2. API Tra cứu danh sách các sản phẩm thuộc về một Đơn hàng cụ thể (Theo OrderId)
        [HttpGet("order/{orderId}")]
        public IActionResult GetByOrderId(int orderId)
        {
            var orderExists = _context.Orders.Any(o => o.Id == orderId);
            if (!orderExists)
            {
                return NotFound(new { message = "Mã đơn hàng này không tồn tại trên hệ thống" });
            }

            var orderDetails = _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .ToList()
                .Select(od => new {
                    od.Id,
                    od.ProductId,
                    ProductName = _context.Products
                        .Where(p => p.Id == od.ProductId)
                        .Select(p => p.Name)
                        .FirstOrDefault() ?? "Sản phẩm không xác định",
                    od.Quantity,
                    od.UnitPrice,
                    SubTotal = od.Quantity * od.UnitPrice
                })
                .ToList();

            return Ok(orderDetails);
        }
    }
}