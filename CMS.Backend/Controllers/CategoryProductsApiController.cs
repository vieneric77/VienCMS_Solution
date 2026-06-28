using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoryProductsController(ApplicationDbContext context) => _context = context;
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts
                .OrderBy(c => c.Name)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    ProductCount = c.Products.Count()
                })
                .ToList();
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.CategoriesProducts
                .Where(c => c.Id == id)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    ProductCount = c.Products.Count()
                })
                .FirstOrDefault();

            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            return Ok(category);
        }
        [HttpPost]
        public IActionResult Create([FromBody] CategoryProduct model)
        {
            ModelState.Remove("Products");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool isDuplicate = _context.CategoriesProducts
                .Any(c => c.Name.ToLower() == model.Name.ToLower());
            if (isDuplicate)
                return Conflict(new { message = "Tên danh mục đã tồn tại" });

            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CategoryProduct model)
        {
            ModelState.Remove("Products");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = _context.CategoriesProducts.Find(id);
            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            bool isDuplicate = _context.CategoriesProducts  
                .Any(c => c.Name.ToLower() == model.Name.ToLower() && c.Id != id);
            if (isDuplicate)
                return Conflict(new { message = "Tên danh mục đã tồn tại" });

            category.Name = model.Name;
            category.Description = model.Description;
            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công", category });
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts
                .Include    (c => c.Products)
                .FirstOrDefault(c => c.Id == id);
                        
            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục ID={id}" });

            if (category.Products != null && category.Products.Any())
                return BadRequest(new { message = $"Không thể xóa, đang có {category.Products.Count} sản phẩm liên kết" });

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            return Ok(new { message = $"Đã xóa danh mục \"{category.Name}\"" });
        }
    }
}
