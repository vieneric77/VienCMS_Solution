using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string ImageUrl { get; set; }

        // Thêm attribute này để EF không nhầm lẫn
        [ForeignKey("CategoryProduct")]
        public int CategoryProductId { get; set; }

        // Navigation property (giúp EF truy vấn dễ hơn)
        public virtual CategoryProduct CategoryProduct { get; set; }
    }
}