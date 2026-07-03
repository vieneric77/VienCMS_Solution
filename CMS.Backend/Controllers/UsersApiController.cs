using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UsersController(ApplicationDbContext context) => _context = context;

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .OrderBy(u => u.FullName)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _context.Users
                .Where(u => u.Id == id)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefault();

            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng ID={id}" });

            return Ok(user);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Role))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin" });

            bool isDuplicate = _context.Users
                .Any(u => u.Username.ToLower() == request.Username.ToLower());
            if (isDuplicate)
                return Conflict(new { message = "Tên đăng nhập đã tồn tại" });

            var user = new User
            {
                Username = request.Username,
                FullName = request.FullName,
                Role = request.Role,
                PasswordHash = HashPassword(request.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Role
            });
        }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}