using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/apicategory")] // Địa chỉ gọi API mới
    [ApiController]
    public class ApiCategoryController : ControllerBase // Dùng ControllerBase cho API
    {
        private readonly ApplicationDbContext _context;

        public ApiCategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/apicategory
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories); // Trả về JSON cho React
        }
    }
}