using Microsoft.EntityFrameworkCore;
using CMS.Data;
// Thêm namespace này để dùng được CookieAuthenticationDefaults
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================================================
// CHÈN TẠI ĐÂY: Trước dòng var app = builder.Build();
// 1. Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    });
// =========================================================================
// Đăng ký dịch vụ Swagger vào hệ thống
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// 1. Khai báo chính sách CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn (Origin), mọi phương thức (GET, POST...), mọi tiêu đề (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var app = builder.Build();
// Kích hoạt Swagger UI cho cả môi trường Development và Production để dễ kiểm thử
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS API v1");
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAll");

// =========================================================================
// CHÈN TẠI ĐÂY: Ngay trước app.UseAuthorization();
app.UseAuthentication(); // BƯỚC A: Xác nhận "Anh là ai?" (Kiểm tra thẻ bài)
// =========================================================================
app.UseAuthorization();  // BƯỚC B: Xác nhận "Anh được làm gì?" (Kiểm tra quyền)

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();