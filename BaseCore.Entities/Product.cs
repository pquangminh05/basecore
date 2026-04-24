using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BaseCore.Entities
{
    public class Product
    {
        [BsonId]
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string ImageUrl { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int? ProductTypeId { get; set; }

        public int? ManufacturerId { get; set; }

        public int? ColorId { get; set; }

        public int? SizeId { get; set; }

        [BsonIgnore]
        public Category? Category { get; set; }

        [BsonIgnore]
        public ProductType? ProductType { get; set; }

        [BsonIgnore]
        public Manufacturer? Manufacturer { get; set; }

        [BsonIgnore]
        public ProductColor? Color { get; set; }

        [BsonIgnore]
        public ProductSize? Size { get; set; }
    }
}
