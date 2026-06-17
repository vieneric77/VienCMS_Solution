using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

public class BannerController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public BannerController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task<IActionResult> Index() => View(await _context.Banners.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var path = Path.Combine(_env.WebRootPath, "uploads", fileName);
            using (var stream = new FileStream(path, FileMode.Create)) await file.CopyToAsync(stream);

            _context.Banners.Add(new Banner { ImageUrl = "/uploads/" + fileName, IsActive = false });
            await _context.SaveChangesAsync();
        }
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> SetStatus(int id)
    {
        var banners = await _context.Banners.ToListAsync();
        foreach (var b in banners) b.IsActive = (b.Id == id);
        await _context.SaveChangesAsync();
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner != null) { _context.Banners.Remove(banner); await _context.SaveChangesAsync(); }
        return RedirectToAction("Index");
    }
}