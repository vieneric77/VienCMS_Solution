using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BannersController(ApplicationDbContext context) => _context = context;

        [HttpGet("active")]
        public IActionResult GetActiveBanners()
        {
            var banners = _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.DisplayOrder
                })
                .ToList();

            return Ok(banners);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var banners = _context.Banners
                .OrderBy(b => b.DisplayOrder)
                .ToList();
            return Ok(banners);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });
            return Ok(banner);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Banner model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.CreatedDate = DateTime.Now;
            _context.Banners.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPatch("{id}/toggle-active")]
        public IActionResult ToggleActive(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound(new { message = $"Không tìm thấy banner ID={id}" });

            banner.IsActive = !banner.IsActive;
            _context.SaveChanges();
            return Ok(new { message = "Đã cập nhật trạng thái", banner.Id, banner.IsActive });
        }
    }
}