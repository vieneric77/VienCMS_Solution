using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderController(ApplicationDbContext context) => _context = context;

        public IActionResult Index()
        {
            var orders = _context.Orders.Include(o => o.Customer).OrderByDescending(o => o.Id).ToList();
            return View(orders);
        }

        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);
            return order == null ? NotFound() : View(order);
        }

        [HttpPost]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.Status = status;
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}