using MongoDB.Bson.Serialization.Attributes;

namespace BaseCore.Entities
{
    public class ProductSize
    {
        [BsonId]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
    }
}
