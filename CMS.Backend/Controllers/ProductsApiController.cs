using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderBy(p => p.Name)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound(new { message = $"Không tìm thấy sản phẩm ID={id}" });

            return Ok(product);
        }

        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .OrderBy(p => p.Name)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToList();
            return Ok(products);
        }

        [HttpGet("best-selling")]
        public IActionResult GetBestSelling([FromQuery] int top = 3)
        {
            var products = _context.Products
                .Include(p => p.OrderDetails)
                .OrderByDescending(p => p.OrderDetails.Sum(od => (int?)od.Quantity) ?? 0)
                .Take(top)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    TotalSold = p.OrderDetails.Sum(od => (int?)od.Quantity) ?? 0,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("by-price")]
        public IActionResult GetByPrice(
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string sort = "asc")
        {
            var query = _context.Products.AsQueryable();

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            query = sort?.ToLower() == "desc"
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price);

            var products = query
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("highest-price")]
        public IActionResult GetHighestPrice([FromQuery] int top = 5)
        {
            var products = _context.Products
                .OrderByDescending(p => p.Price)
                .Take(top)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("lowest-price")]
        public IActionResult GetLowestPrice([FromQuery] int top = 5)
        {
            var products = _context.Products
                .OrderBy(p => p.Price)
                .Take(top)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("latest")]
        public IActionResult GetLatestProducts()
        {
            var products = _context.Products
                .OrderByDescending(p => p.CreatedAt)
                .Take(3)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.CreatedAt
                })
                .ToList();
            return Ok(products);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Product model)
        {
            ModelState.Remove("CategoryProduct");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool categoryExists = _context.CategoriesProducts.Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
                return BadRequest(new { message = "Danh mục sản phẩm không tồn tại" });

            _context.Products.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }
    }
}