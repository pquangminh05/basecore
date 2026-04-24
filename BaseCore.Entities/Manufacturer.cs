using MongoDB.Bson.Serialization.Attributes;

namespace BaseCore.Entities
{
    public class Manufacturer
    {
        [BsonId]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
