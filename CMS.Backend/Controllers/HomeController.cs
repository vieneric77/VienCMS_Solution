using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    // Tạo class để chứa dữ liệu demo
    public class OrderDemo
    {
        public int Id { get; set; }
        public string OrderDate { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.TotalRevenue = 150000000;
            ViewBag.TotalOrders = 45;

            var demoOrders = new List<OrderDemo>
            {
                new OrderDemo { Id = 1, OrderDate = "17/06/2026", CustomerName = "Nguyễn Văn A", TotalAmount = 2500000 },
                new OrderDemo { Id = 2, OrderDate = "16/06/2026", CustomerName = "Trần Thị B", TotalAmount = 1200000 },
                new OrderDemo { Id = 3, OrderDate = "15/06/2026", CustomerName = "Lê Văn C", TotalAmount = 3800000 }
            };

            return View(demoOrders);
        }
    }
}