using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderDetailController(ApplicationDbContext context) => _context = context;

        // Action Index để hiển thị danh sách toàn bộ OrderDetails
        public IActionResult Index()
        {
            var details = _context.OrderDetails
                .Include(od => od.Product) // Lấy tên sản phẩm
                .Include(od => od.Order)   // Lấy thông tin đơn hàng (để biết ID đơn)
                .OrderByDescending(od => od.Id)
                .ToList();

            return View(details);
        }
    }
}