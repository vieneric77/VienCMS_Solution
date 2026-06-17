using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/CategoriesProducts")]
    [ApiController]
    [Tags("CategoriesProducts")] 
    public class ProductCategoryController : ControllerBase
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
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục này." });
            }
            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            ModelState.Remove("Products");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newCategory = new CategoryProduct
            {
                Name = model.Name,
                Description = model.Description
            };

            _context.CategoriesProducts.Add(newCategory);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = newCategory.Id }, newCategory);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, CategoryProduct model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "ID không trùng khớp." });
            }

            ModelState.Remove("Products");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần sửa." });
            }

            category.Name = model.Name;
            category.Description = model.Description;

            _context.CategoriesProducts.Update(category);
            _context.SaveChanges();

            return Ok(new { message = "Cập nhật danh mục thành công.", data = category });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục cần xóa." });
            }

            var hasProducts = _context.Products.Any(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                return BadRequest(new { message = "Không thể xóa danh mục này vì đang có sản phẩm thuộc về nó." });
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();

            return Ok(new { message = "Xóa danh mục thành công." });
        }
    }
}