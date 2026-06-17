using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductApi
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts.ToList();
            var products = _context.Products.ToList().Select(p => new {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.ImageUrl,
                CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryProductId)?.Name ?? ""
            }).ToList();
            return Ok(products);
        }

        // GET: api/ProductApi/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var categories = _context.CategoriesProducts.ToList();
            var products = _context.Products.Where(p => p.CategoryProductId == categoryId).ToList().Select(p => new {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.ImageUrl,
                CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryProductId)?.Name ?? ""
            }).ToList();
            return Ok(products);
        }
    }
}