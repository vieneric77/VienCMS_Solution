using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var customers = _context.Customers.OrderBy(c => c.FullName).ToList();
            return View(customers);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (!ModelState.IsValid)
                return View(model);

            bool isDuplicate = _context.Customers
                .Any(c => c.Email.ToLower() == model.Email.ToLower());

            if (isDuplicate)
            {
                ModelState.AddModelError("Email", "Email khách hàng này đã tồn tại trên hệ thống!");
                return View(model);
            }

            try
            {
                _context.Customers.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã thêm tài khoản khách hàng \"{model.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi hệ thống khi lưu dữ liệu khách hàng.");
                return View(model);
            }
        }

        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy thông tin khách hàng cần chỉnh sửa.";
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Customer model)
        {
            if (id != model.Id) return BadRequest();

            if (!ModelState.IsValid) return View(model);

            bool isDuplicate = _context.Customers
                .Any(c => c.Email.ToLower() == model.Email.ToLower() && c.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng bởi một khách hàng khác!");
                return View(model);
            }

            try
            {
                var customer = _context.Customers.Find(id);
                if (customer == null) return NotFound();
                customer.FullName = model.FullName;
                customer.Email = model.Email;
                customer.Phone = model.Phone;
                customer.Address = model.Address;
                customer.Password = model.Password;

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Cập nhật thông tin khách hàng \"{customer.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Không thể lưu thay đổi. Vui lòng kiểm tra lại kết nối Database.");
                return View(model);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var customer = _context.Customers.Find(id);
                if (customer == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy khách hàng cần xóa.";
                    return RedirectToAction("Index");
                }
                bool hasOrders = _context.Orders.Any(o => o.CustomerId == id);
                if (hasOrders)
                {
                    TempData["ErrorMessage"] = $"Không thể xóa khách hàng \"{customer.FullName}\" vì tài khoản này đã có lịch sử đặt mua đơn hàng cơ khí!";
                    return RedirectToAction("Index");
                }

                _context.Customers.Remove(customer);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa tài khoản khách hàng \"{customer.FullName}\" khỏi hệ thống.";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi trong tiến trình xóa dữ liệu.";
            }

            return RedirectToAction("Index");
        }

        [HttpGet("/api/Customers/{id}")]
        public IActionResult GetCustomerApi(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            return Json(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                phone = customer.Phone,
                address = customer.Address,
                email = customer.Email
            });
        }
    }
}