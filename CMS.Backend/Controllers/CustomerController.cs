using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(string searchString)
        {
            var customers = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                customers = customers.Where(c => c.FullName.Contains(searchString) || c.Email.Contains(searchString));
            }

            return View(customers.ToList());
        }

        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(CMS.Data.Entities.Customer customer)
        {
            _context.Customers.Update(customer);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Orders(int id)
        {
            var orders = _context.Orders.Where(o => o.CustomerId == id).ToList();
            ViewBag.CustomerName = _context.Customers.Find(id)?.FullName;
            return View(orders);
        }

        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null && !_context.Orders.Any(o => o.CustomerId == id))
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}