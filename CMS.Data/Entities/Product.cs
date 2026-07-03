using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }

        public bool IsHot { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        // --- ĐÃ THÊM: Navigation Property để kết nối với chi tiết đơn hàng ---
        // Lưu ý: Đảm bảo class OrderDetail đã tồn tại trong dự án của bạn
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}