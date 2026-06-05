using System.Collections.Generic;

namespace CMS.Backend.DTO
{
    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderCreateDto
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<CartItemDto> Items { get; set; }
    }
}