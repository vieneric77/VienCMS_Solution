using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // 1. Danh sách sản phẩm (Đã thêm phân trang)
        public IActionResult Index(int page = 1)
        {
            int pageSize = 5;
            var totalProducts = _context.Products.Count();
            ViewBag.TotalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);
            ViewBag.CurrentPage = page;

            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return View(products);
        }

        // 2. Form thêm mới
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            ModelState.Remove("uploadImage");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                if (uploadImage != null) model.ImageUrl = SaveImage(uploadImage);
                else model.ImageUrl = "/images/products/default.jpg";

                _context.Products.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // 3. Form cập nhật
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }
        // Thay đổi route để chắc chắn React gọi đúng địa chỉ
        [HttpGet("api/products/search")]
        public IActionResult Search(string q)
        {
            // Kiểm tra nếu query null hoặc rỗng
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<Product>());
            }

            // Tìm kiếm không phân biệt chữ hoa/thường
            var products = _context.Products
                .Where(p => p.Name.ToLower().Contains(q.ToLower()))
                .ToList();

            return Ok(products);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Product model, IFormFile? uploadImage)
        {
            ModelState.Remove("uploadImage");
            ModelState.Remove("ImageUrl");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                var product = _context.Products.Find(id);
                if (product == null) return NotFound();

                product.Name = model.Name;
                product.Price = model.Price;
                product.Description = model.Description;
                product.StockQuantity = model.StockQuantity;
                product.CategoryProductId = model.CategoryProductId;

                if (uploadImage != null) product.ImageUrl = SaveImage(uploadImage);

                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // 4. Xóa
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private string SaveImage(IFormFile image)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                image.CopyTo(stream);
            }
            return "/images/products/" + fileName;
        }
    }
}