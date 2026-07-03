using MailKit.Net.Smtp;
using MimeKit;
using System; // Cần thiết để xử lý Exception
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        // Đổi tên thành SendEmailAsync để dùng chung cho mọi chức năng
        public async Task SendEmailAsync(string customerEmail, string subject, string content)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("vieneric77@gmail.com"));
            email.To.Add(MailboxAddress.Parse(customerEmail));
            email.Subject = subject;

            // Nội dung email dạng HTML
            var builder = new BodyBuilder { HtmlBody = content };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                // Kết nối tới server Gmail
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                // Đăng nhập với email và mật khẩu ứng dụng
                await smtp.AuthenticateAsync("vieneric77@gmail.com", "nxhdueprkmkucazc");

                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                // Ghi log chi tiết ra Output của Visual Studio để bạn debug
                System.Diagnostics.Debug.WriteLine($"Lỗi tại EmailService: {ex.Message}");
                // Ném lại ngoại lệ để Controller biết quá trình gửi mail bị thất bại
                throw;
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}