using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using CMS.Backend.DTO;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API Đặt hàng tổng hợp (Tạo Đơn hàng, lưu Chi tiết đơn hàng và Trừ số lượng tồn kho)
        [HttpPost]
        public IActionResult CreateOrder([FromBody] OrderCreateDto model)
        {
            // Kiểm tra xem khách hàng có tồn tại hay không
            var customerExists = _context.Customers.Any(c => c.Id == model.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new { message = "Khách hàng không tồn tại trên hệ thống" });
            }

            if (model.Items == null || !model.Items.Any())
            {
                return BadRequest(new { message = "Giỏ hàng của bạn đang trống" });
            }

            // Kích hoạt cơ chế giao dịch an toàn (Transaction)
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Tạo mới đơn hàng tổng quát
                var order = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = model.CustomerId,
                    Status = 0, // 0: Chờ duyệt
                    Notes = model.Notes
                };

                _context.Orders.Add(order);
                _context.SaveChanges(); // Lưu trước để sinh ra Order.Id tự động

                decimal totalOrderPrice = 0;
                var detailsResult = new List<object>();

                // Duyệt qua từng sản phẩm trong giỏ hàng gửi lên
                foreach (var item in model.Items)
                {
                    var product = _context.Products.Find(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại" });
                    }

                    // Kiểm tra số lượng tồn kho (StockQuantity)
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ số lượng trong kho (Hiện còn: {product.StockQuantity})" });
                    }

                    // Thực hiện trừ kho trực tiếp
                    product.StockQuantity -= item.Quantity;

                    // Tạo chi tiết đơn hàng tương ứng
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price // Bảo toàn giá tại thời điểm mua
                    };

                    _context.OrderDetails.Add(orderDetail);
                    totalOrderPrice += (orderDetail.Quantity * orderDetail.UnitPrice);

                    detailsResult.Add(new
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        SubTotal = item.Quantity * product.Price
                    });
                }

                _context.SaveChanges();
                transaction.Commit(); // Hoàn tất giao dịch thành công

                return StatusCode(201, new
                {
                    OrderId = order.Id,
                    OrderDate = order.OrderDate,
                    Status = "Chờ duyệt (Mã: 0)",
                    Notes = order.Notes,
                    Items = detailsResult,
                    TotalPrice = totalOrderPrice
                });
            }
            catch (Exception)
            {
                transaction.Rollback(); // Hủy bỏ toàn bộ thao tác nếu xảy ra lỗi hệ thống bất ngờ
                return StatusCode(500, new { message = "Đã xảy ra lỗi hệ thống khi xử lý quy trình đặt hàng" });
            }
        }

        // 2. API Xem toàn bộ lịch sử đơn hàng hệ thống
        [HttpGet]
        public IActionResult GetAllOrders()
        {
            var orders = _context.Orders
                .OrderByDescending(o => o.Id)
                .ToList()
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    StatusText = o.Status == 0 ? "Chờ duyệt" : o.Status == 1 ? "Đang giao" : "Đã xong",
                    o.Notes,
                    CustomerName = _context.Customers.Where(c => c.Id == o.CustomerId).Select(c => c.FullName).FirstOrDefault()
                })
                .ToList();

            return Ok(orders);
        }
    }
}