using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthApiController(ApplicationDbContext context) => _context = context;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower() && c.Password == model.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                customerId = customer.Id,
                fullName = customer.FullName,
                role = "Khách hàng"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer model)
        {
            if (model == null) return BadRequest("Dữ liệu không hợp lệ");

            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == model.Email.ToLower());
            if (exists) return BadRequest(new { message = "Email này đã được đăng ký!" });

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập Email!" });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null)
            {
                return NotFound(new { message = "Email không tồn tại!" });
            }

            var random = new Random();
            string newPlainPassword = random.Next(100000, 999999).ToString();

            customer.Password = newPlainPassword;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xác thực thành công!", newPassword = newPlainPassword });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers.FindAsync(model.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = "Tài khoản không tồn tại!" });
            }

            if (customer.Password != model.OldPassword)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác!" });
            }

            customer.Password = model.NewPassword;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }
    }

    public class CustomerLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class ChangePasswordDto
    {
        public int CustomerId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}