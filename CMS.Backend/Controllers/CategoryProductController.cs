using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // BỎ CÁC THUỘC TÍNH API Ở ĐÂY
    public class ProductCategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Trả về View thay vì Ok()
            var categories = _context.CategoriesProducts.OrderByDescending(c => c.Id).ToList();
            return View(categories);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken] // Luôn dùng để bảo mật cho Form
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();

            var hasProducts = _context.Products.Any(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                // Thông báo lỗi cho người dùng bằng TempData
                TempData["ErrorMessage"] = "Không thể xóa danh mục này vì đang có sản phẩm thuộc về nó.";
                return RedirectToAction(nameof(Index));
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}