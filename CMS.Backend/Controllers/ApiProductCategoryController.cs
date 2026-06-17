// File: Controllers/Api/ApiProductCategoryController.cs
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/CategoriesProducts")] // Giữ nguyên route này để React không bị lỗi
    [ApiController]
    public class ApiProductCategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ApiProductCategoryController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts.OrderByDescending(c => c.Id).ToList();
            return Ok(categories); // Trả về JSON cho React
        }
    }
}