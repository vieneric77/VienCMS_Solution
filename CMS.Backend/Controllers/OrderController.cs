using CMS.Data;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System.Text;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
            _emailService = new EmailService();
        }

        public async Task<IActionResult> Index(int? status)
        {
            var query = _context.Orders.Include(o => o.Customer).AsQueryable();
            if (status.HasValue) query = query.Where(o => o.Status == status.Value);

            var orders = await query.OrderByDescending(o => o.Id).ToListAsync();
            return View(orders);
        }

        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return RedirectToAction(nameof(Index));
            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();

            // Gửi email nếu trạng thái là 2 (Đã xác nhận)
            if (status == 2 && order.Customer != null && !string.IsNullOrEmpty(order.Customer.Email))
            {
                string subject = $"Xác nhận đơn hàng #{order.Id} từ BookStore";

                StringBuilder productTableRows = new StringBuilder();
                decimal totalAmount = 0;

                foreach (var item in order.OrderDetails)
                {
                    // Đã sửa: Dùng UnitPrice thay vì Price
                    decimal lineTotal = item.UnitPrice * item.Quantity;
                    totalAmount += lineTotal;

                    productTableRows.Append($@"
                        <tr>
                            <td style='padding: 10px; border-bottom: 1px solid #eee;'>{item.Product?.Name}</td>
                            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>{item.Quantity}</td>
                            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>{item.UnitPrice.ToString("N0")} ₫</td>
                            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>{lineTotal.ToString("N0")} ₫</td>
                        </tr>");
                }

                string content = $@"
                <div style='background-color: #f4f4f5; padding: 30px 10px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);'>
                        <div style='background-color: #d97706; padding: 25px; text-align: center;'>
                            <h2 style='color: #ffffff; margin: 0; font-size: 26px; text-transform: uppercase;'>BookStore</h2>
                        </div>
                        <div style='padding: 30px;'>
                            <h3>Xin chào {order.Customer.FullName},</h3>
                            <p>Đơn hàng <strong>#{order.Id}</strong> của bạn đã được xác nhận!</p>
                            
                            <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                                <thead>
                                    <tr style='background-color: #f9fafb;'>
                                        <th style='padding: 10px; text-align: left; border-bottom: 2px solid #ddd;'>Sản phẩm</th>
                                        <th style='padding: 10px; text-align: center; border-bottom: 2px solid #ddd;'>SL</th>
                                        <th style='padding: 10px; text-align: right; border-bottom: 2px solid #ddd;'>Giá</th>
                                        <th style='padding: 10px; text-align: right; border-bottom: 2px solid #ddd;'>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productTableRows}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan='3' style='padding: 10px; text-align: right; font-weight: bold;'>Tổng thanh toán:</td>
                                        <td style='padding: 10px; text-align: right; font-weight: bold; color: #d97706;'>{totalAmount.ToString("N0")} ₫</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <p>Đội ngũ BookStore đang chuẩn bị hàng và sẽ gửi đến bạn sớm nhất.</p>
                        </div>
                    </div>
                </div>";

                await _emailService.SendEmailAsync(order.Customer.Email, subject, content);
            }

            return RedirectToAction(nameof(Details), new { id = order.Id });
        }
    }
}