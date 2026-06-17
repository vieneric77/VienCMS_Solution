using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .ToList();

            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            ModelState.Remove("uploadImage");
            ModelState.Remove("ImageUrl");

            var categoryExists = _context.CategoriesProducts.Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
            {
                ModelState.AddModelError("", "Danh mục sản phẩm không tồn tại trong hệ thống");
                ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            if (ModelState.IsValid)
            {
                var newProduct = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    Price = model.Price,
                    StockQuantity = model.StockQuantity,
                    CategoryProductId = model.CategoryProductId
                };

                if (uploadImage != null && uploadImage.Length > 0)
                {
                    try
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                        if (!Directory.Exists(uploadDir))
                        {
                            Directory.CreateDirectory(uploadDir);
                        }

                        var filePath = Path.Combine(uploadDir, fileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            uploadImage.CopyTo(fileStream);
                        }

                        newProduct.ImageUrl = "/images/products/" + fileName;
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("", "Lỗi trong quá trình lưu file ảnh: " + ex.Message);
                        ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                        return View(model);
                    }
                }
                else
                {
                    newProduct.ImageUrl = "/images/products/default.jpg";
                }

                _context.Products.Add(newProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Product model, IFormFile? uploadImage)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            ModelState.Remove("uploadImage");
            ModelState.Remove("ImageUrl");

            var categoryExists = _context.CategoriesProducts.Any(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
            {
                ModelState.AddModelError("", "Danh mục sản phẩm không tồn tại trong hệ thống");
                ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            if (ModelState.IsValid)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == id);
                if (product == null)
                {
                    return NotFound();
                }

                if (uploadImage != null && uploadImage.Length > 0)
                {
                    try
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                        if (!Directory.Exists(uploadDir))
                        {
                            Directory.CreateDirectory(uploadDir);
                        }

                        var filePath = Path.Combine(uploadDir, fileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            uploadImage.CopyTo(fileStream);
                        }

                        product.ImageUrl = "/images/products/" + fileName;
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("", "Lỗi trong quá trình lưu file ảnh: " + ex.Message);
                        ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
                        return View(model);
                    }
                }
                else
                {
                    product.ImageUrl = model.ImageUrl;
                }

                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.StockQuantity = model.StockQuantity;
                product.CategoryProductId = model.CategoryProductId;

                _context.Products.Update(product);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts.ToList(), "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            var isOrdered = _context.OrderDetails.Any(od => od.ProductId == id);
            if (isOrdered)
            {
                return BadRequest("Không thể xóa sản phẩm vì đã tồn tại lịch sử giao dịch");
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("api/Product")]
        public IActionResult GetAllApi()
        {
            var categories = _context.CategoriesProducts.ToList();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var products = _context.Products
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId
                })
                .ToList()
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl) ? baseUrl + p.ImageUrl : baseUrl + "/images/products/default.jpg",
                    p.CategoryProductId,
                    CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryProductId)?.Name ?? ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("api/Product/category/{categoryId}")]
        public IActionResult GetByCategoryApi(int categoryId)
        {
            var categories = _context.CategoriesProducts.ToList();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId
                })
                .ToList()
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl) ? baseUrl + p.ImageUrl : baseUrl + "/images/products/default.jpg",
                    p.CategoryProductId,
                    CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryProductId)?.Name ?? ""
                })
                .ToList();

            return Ok(products);
        }
    }
}