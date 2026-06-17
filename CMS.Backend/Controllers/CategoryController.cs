using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/Categories")] // Khớp với url = '/Categories' bên Frontend
    [ApiController]
    [Tags("Categories")]
    public class CategoryController : ControllerBase // Đổi sang ControllerBase để làm API
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public IActionResult Index()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories); // Trả về JSON chuẩn cho ReactJS bóc tách
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound(new { message = "Không tìm thấy." });
            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        public IActionResult Create(Category model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Categories.Add(model);
            _context.SaveChanges();
            return Ok(model);
        }

        // PUT: api/Categories
        [HttpPut]
        public IActionResult Edit(Category model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Categories.Update(model);
            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công.", data = model });
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound(new { message = "Không tìm thấy để xóa." });

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok(new { message = "Xóa thành công." });
        }
    }
}