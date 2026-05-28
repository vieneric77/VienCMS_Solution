using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Để nhận diện ApplicationDbContext
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào Constructor
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách bài viết
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách bài viết từ SQL Server
            var listPost = _context.Posts.ToList();

            // Truyền danh sách bài viết sang View hiển thị
            return View(listPost);
        }
    }
}