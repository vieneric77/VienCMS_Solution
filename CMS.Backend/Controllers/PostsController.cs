using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var posts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại",
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl) ? baseUrl + p.ImageUrl : "https://picsum.photos/400/250"
                })
                .ToList();

            return Ok(posts);
        }

        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.CreatedDate,
                    ImageUrl = !string.IsNullOrEmpty(p.ImageUrl) ? baseUrl + p.ImageUrl : "https://picsum.photos/400/250"
                })
                .ToList();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }
    }
}