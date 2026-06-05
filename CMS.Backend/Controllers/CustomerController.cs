using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using CMS.Backend.DTO;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API Lấy toàn bộ danh sách khách hàng
        [HttpGet]
        public IActionResult GetAll()
        {
            var customers = _context.Customers
                .OrderByDescending(c => c.Id)
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToList();

            return Ok(customers);
        }

        // 2. API Xem chi tiết thông tin một khách hàng theo ID
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var customer = _context.Customers
                .Where(c => c.Id == id)
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefault();

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng yêu cầu" });
            }

            return Ok(customer);
        }

        // 3. API Đăng ký / Thêm mới tài khoản khách hàng
        [HttpPost]
        public IActionResult Create([FromBody] Customer model)
        {
            // Kiểm tra ràng buộc duy nhất: Tránh việc đăng ký trùng lặp Email trên hệ thống
            var isEmailExist = _context.Customers.Any(c => c.Email == model.Email);
            if (isEmailExist)
            {
                return BadRequest(new { message = "Email này đã được sử dụng để đăng ký tài khoản" });
            }

            var newCustomer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                Password = model.Password // Lưu ý: Trong thực tế dự án lớn cần mã hóa mật khẩu trước khi lưu
            };

            _context.Customers.Add(newCustomer);
            _context.SaveChanges();

            // Trả về mã thành công 201 kèm thông tin sạch (ẩn mật khẩu)
            return StatusCode(201, new
            {
                newCustomer.Id,
                newCustomer.FullName,
                newCustomer.Email,
                newCustomer.Phone,
                newCustomer.Address
            });
        }

        // 4. API Xóa tài khoản khách hàng
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Tài khoản khách hàng không tồn tại" });
            }

            // Kiểm tra toàn vẹn dữ liệu: Nếu khách hàng đã phát sinh hóa đơn mua hàng thì cấm xóa
            var hasOrders = _context.Orders.Any(o => o.CustomerId == id);
            if (hasOrders)
            {
                return BadRequest(new { message = "Không thể xóa khách hàng này vì dữ liệu đã liên kết với lịch sử đơn hàng" });
            }

            _context.Customers.Remove(customer);
            _context.SaveChanges();

            return Ok(new { message = "Xóa thông tin khách hàng thành công" });
        }
    }
}