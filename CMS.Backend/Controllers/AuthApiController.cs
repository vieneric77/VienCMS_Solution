using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using BCrypt.Net;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public AuthApiController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null || !BCrypt.Net.BCrypt.Verify(model.Password, customer.Password))
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            return Ok(new { message = "Đăng nhập thành công!", customerId = customer.Id, fullName = customer.FullName, role = "Khách hàng" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer model)
        {
            if (model == null) return BadRequest("Dữ liệu không hợp lệ");

            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == model.Email.ToLower());
            if (exists) return BadRequest(new { message = "Email này đã được đăng ký!" });

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());
            if (customer == null) return NotFound(new { message = "Email không tồn tại!" });

            string otp = new Random().Next(100000, 999999).ToString();
            customer.OtpCode = otp;
            customer.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            string content = $"<h3>Mã xác thực của bạn là: {otp}</h3><p>Mã này có hiệu lực trong 5 phút.</p>";
            await _emailService.SendEmailAsync(customer.Email, "Mã xác nhận đặt lại mật khẩu", content);

            return Ok(new { message = "Mã OTP đã được gửi về email của bạn." });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto model)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null || customer.OtpCode != model.Otp || customer.OtpExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });

            return Ok(new { message = "Xác thực thành công!" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null || customer.OtpCode != model.Otp || customer.OtpExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc đã hết hạn!" });

            customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            customer.OtpCode = null;
            customer.OtpExpiry = null;

            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công!" });
        }
    }

    // DTOs
    public class CustomerLoginDto { public string Email { get; set; } public string Password { get; set; } }
    public class ForgotPasswordDto { public string Email { get; set; } }
    public class VerifyOtpDto { public string Email { get; set; } public string Otp { get; set; } }
    public class ResetPasswordDto { public string Email { get; set; } public string Otp { get; set; } public string NewPassword { get; set; } }
}