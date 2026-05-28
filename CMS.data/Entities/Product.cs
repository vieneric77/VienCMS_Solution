using System;

namespace CMS.Data.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        // Sửa thuộc tính này từ Stock thành StockQuantity cho khớp với cột trong DB
        public int StockQuantity { get; set; }

        public string ImageUrl { get; set; }
        public int CategoryProductId { get; set; } // Khóa ngoại liên kết danh mục
    }
}