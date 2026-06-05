using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var products = _context.Products.OrderByDescending(p => p.Id).ToList();
            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model)
        {
            var categoryExists = _context.CategoriesProducts.Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
            {
                ModelState.AddModelError("", "Danh mục sản phẩm không tồn tại trong hệ thống");
                return View(model);
            }

            if (ModelState.IsValid)
            {
                var newProduct = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    Price = model.Price,
                    StockQuantity = model.StockQuantity,
                    ImageUrl = model.ImageUrl,
                    CategoryProductId = model.CategoryProductId
                };

                _context.Products.Add(newProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Product model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            var categoryExists = _context.CategoriesProducts.Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
            {
                ModelState.AddModelError("", "Danh mục sản phẩm không tồn tại trong hệ thống");
                return View(model);
            }

            if (ModelState.IsValid)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == id);
                if (product == null)
                {
                    return NotFound();
                }

                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.StockQuantity = model.StockQuantity;
                product.ImageUrl = model.ImageUrl;
                product.CategoryProductId = model.CategoryProductId;

                _context.Products.Update(product);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            var isOrdered = _context.OrderDetails.Any(od => od.ProductId == id);
            if (isOrdered)
            {
                return BadRequest("Không thể xóa sản phẩm vì đã tồn tại lịch sử giao dịch");
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}