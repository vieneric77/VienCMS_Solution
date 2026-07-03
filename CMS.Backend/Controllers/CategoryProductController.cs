using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env; // Cần dùng để xác định đường dẫn thư mục

        public CategoryProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public IActionResult Index()
        {
            var categories = _context.CategoriesProducts
                .Include(c => c.Products)
                .OrderBy(c => c.Name)
                .ToList();
            return View(categories);
        }

        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct model, IFormFile? ImageFile)
        {
            ModelState.Remove("Products");
            if (!ModelState.IsValid) return View(model);

            // Xử lý upload ảnh
            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = await SaveImage(ImageFile);
            }

            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã thêm danh mục \"{model.Name}\" thành công!";
            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            return category == null ? NotFound() : View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct model, IFormFile? ImageFile)
        {
            if (id != model.Id) return BadRequest();
            ModelState.Remove("Products");
            if (!ModelState.IsValid) return View(model);

            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();

            // Cập nhật thông tin
            category.Name = model.Name;
            category.Description = model.Description;

            // Nếu có chọn ảnh mới thì lưu đè
            if (ImageFile != null && ImageFile.Length > 0)
            {
                category.ImageUrl = await SaveImage(ImageFile);
            }

            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã cập nhật \"{model.Name}\" thành công!";
            return RedirectToAction("Index");
        }

        // Hàm bổ trợ lưu ảnh
        private async Task<string> SaveImage(IFormFile imageFile)
        {
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            string uploadPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            string filePath = Path.Combine(uploadPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            return "/images/" + fileName;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Include(c => c.Products).FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound();

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            TempData["SuccessMessage"] = "Đã xóa thành công!";
            return RedirectToAction("Index");
        }
    }
}