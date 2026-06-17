using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index() => View(_context.Categories.ToList());

        // --- CÁC HÀM CẦN THIẾT ĐỂ CÓ LINK THÊM/SỬA/XÓA ---

        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Edit(int id) => View(_context.Categories.Find(id));

        [HttpPost]
        public IActionResult Edit(Category category)
        {
            _context.Categories.Update(category);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null) { _context.Categories.Remove(category); _context.SaveChanges(); }
            return RedirectToAction(nameof(Index));
        }
    }
}