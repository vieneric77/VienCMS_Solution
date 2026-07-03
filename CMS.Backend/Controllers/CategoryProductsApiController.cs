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
                    c.ImageUrl,
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
                    c.ImageUrl,
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
    }
}