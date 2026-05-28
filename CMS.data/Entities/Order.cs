using System;

namespace CMS.Data.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public int CustomerId { get; set; }

        public int Status { get; set; }

        public string Notes { get; set; }
    }
}