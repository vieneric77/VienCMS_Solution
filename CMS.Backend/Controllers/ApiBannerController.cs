using CMS.Data;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class BannerApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public BannerApiController(ApplicationDbContext context) => _context = context;

    [HttpGet("active")]
    public IActionResult GetActive()
    {
        var banner = _context.Banners.FirstOrDefault(b => b.IsActive);
        return Ok(banner);
    }
}