using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
            var categories = _context.CategoriesProducts.OrderByDescending(c => c.Id).ToList();
            return View(categories);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                var newCategory = new CategoryProduct
                {
                    Name = model.Name,
                    Description = model.Description
                };

                _context.CategoriesProducts.Add(newCategory);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, CategoryProduct model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
                if (category == null)
                {
                    return NotFound();
                }

                category.Name = model.Name;
                category.Description = model.Description;

                _context.CategoriesProducts.Update(category);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            var hasProducts = _context.Products.Any(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                return BadRequest("Không thể xóa danh mục này vì đang có sản phẩm thuộc về nó");
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}