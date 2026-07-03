using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100, ErrorMessage = "Tên danh mục tối đa 100 ký tự")]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Bổ sung thuộc tính lưu đường dẫn ảnh
        [StringLength(500, ErrorMessage = "Đường dẫn ảnh quá dài")]
        public string? ImageUrl { get; set; }

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }

        public CategoryProduct()
        {
            Products = new List<Product>(); // Khởi tạo để tránh NullReferenceException
        }
    }
}