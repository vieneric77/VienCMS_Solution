using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var products = _context.Products
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl)
                        ? (p.ImageUrl.StartsWith("/") ? baseUrl + p.ImageUrl : baseUrl + "/" + p.ImageUrl)
                        : "https://picsum.photos/400/250"
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl)
                        ? (p.ImageUrl.StartsWith("/") ? baseUrl + p.ImageUrl : baseUrl + "/" + p.ImageUrl)
                        : "https://picsum.photos/400/250"
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl)
                        ? (p.ImageUrl.StartsWith("/") ? baseUrl + p.ImageUrl : baseUrl + "/" + p.ImageUrl)
                        : "https://picsum.photos/400/250"
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
    }
}