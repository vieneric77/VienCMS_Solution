using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        public UserController(ApplicationDbContext context) => _context = context;
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
        public IActionResult Index()
        {
            var users = _context.Users.ToList(); 
            return View(users);
        }
        public IActionResult Create()
        {
            ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model, string Password)
        {
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            if (_context.Users.Any(u => u.Username.ToLower() == model.Username.ToLower()))
            {
                ModelState.AddModelError("Username", "Tên đăng nhập nội bộ này đã tồn tại!");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            if (string.IsNullOrWhiteSpace(Password))
            {
                ModelState.AddModelError("Password", "Mật khẩu hệ thống không được để trống");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" });
                return View(model);
            }

            model.PasswordHash = HashPassword(Password);
            _context.Users.Add(model);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã thêm nhân viên \"{model.FullName}\" thành công!";
            return RedirectToAction("Index");
        }
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy tài khoản nhân viên nội bộ cần sửa.";
                return RedirectToAction("Index");
            }
            ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, user.Role);
            return View(user);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string NewPassword)
        {
            if (id != model.Id) return BadRequest();

            ModelState.Remove("PasswordHash");
            ModelState.Remove("NewPassword");

            if (!ModelState.IsValid)
            {
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }

            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == model.Username.ToLower() && u.Id != id);

            if (isDuplicate)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập hệ thống này đã tồn tại");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }

            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy tài khoản nhân viên nội bộ cần sửa.";
                    return RedirectToAction("Index");
                }

                user.Username = model.Username;
                user.FullName = model.FullName;
                user.Role = model.Role;
                if (!string.IsNullOrWhiteSpace(NewPassword))
                {
                    user.PasswordHash = HashPassword(NewPassword);
                }

                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã cập nhật thông tin nhân viên \"{user.FullName}\" thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Đã xảy ra lỗi trong quá trình lưu dữ liệu hệ thống.");
                ViewBag.Roles = new SelectList(new[] { "Admin", "Nhân viên kho", "Kế toán" }, model.Role);
                return View(model);
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy nhân viên hệ thống cần xóa.";
                    return RedirectToAction("Index");
                }
                var currentAdminName = User.Identity?.Name;
                if (user.Username.Equals(currentAdminName, StringComparison.OrdinalIgnoreCase))
                {
                    TempData["ErrorMessage"] = "Lỗi bảo mật: Bạn không được phép tự xóa tài khoản quản trị của chính mình khi đang phiên làm việc!";
                    return RedirectToAction("Index");
                }

                _context.Users.Remove(user);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa tài khoản nhân viên \"{user.FullName}\" thành công!";
            }
            catch (Exception)
            {
                TempData["ErrorMessage"] = "Đã xảy ra lỗi ngoại lệ khi thực hiện xóa dữ liệu.";
            }

            return RedirectToAction("Index");
        }
    }
}