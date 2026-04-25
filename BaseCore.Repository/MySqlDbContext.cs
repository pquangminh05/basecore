using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;

namespace BaseCore.Repository
{
    /// <summary>
    /// Entity Framework Core DbContext for MySQL
    /// Used for teaching EF Core concepts (Bài 10)
    /// </summary>
    public class MySqlDbContext : DbContext
    {
        public MySqlDbContext(DbContextOptions<MySqlDbContext> options) : base(options)
        {
        }

        // DbSet for each entity
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<ProductColor> ProductColors { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                //entity.HasKey(e => e.Guid);
                entity.Property(e => e.UserName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Password).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.HasIndex(e => e.UserName).IsUnique();
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<ProductType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<Manufacturer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<ProductColor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            });

            modelBuilder.Entity<ProductSize>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            });

            // Configure Product entity
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                // Relationship with Category
                entity.HasOne(e => e.Category)
                      .WithMany()
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ProductType)
                      .WithMany()
                      .HasForeignKey(e => e.ProductTypeId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Manufacturer)
                      .WithMany()
                      .HasForeignKey(e => e.ManufacturerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Color)
                      .WithMany()
                      .HasForeignKey(e => e.ColorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Size)
                      .WithMany()
                      .HasForeignKey(e => e.SizeId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Order entity
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.Property(e => e.ShippingAddress).HasMaxLength(500);
            });

            // Configure OrderDetail entity
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);

                // Relationships
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderDetails)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Luxury Watches", Description = "High-end luxury watch models" },
                new Category { Id = 2, Name = "Sport Watches", Description = "Chronograph and sport collections" },
                new Category { Id = 3, Name = "Smart Watches", Description = "Connected smart watch models" },
                new Category { Id = 4, Name = "Classic Watches", Description = "Dress and minimalist watches" },
                new Category { Id = 5, Name = "Watch Accessories", Description = "Straps, boxes, and care tools" }
            );

            modelBuilder.Entity<ProductType>().HasData(
                new ProductType { Id = 1, Name = "Automatic", Description = "Mechanical automatic movement watches" },
                new ProductType { Id = 2, Name = "Quartz", Description = "Quartz movement watches" },
                new ProductType { Id = 3, Name = "Smartwatch", Description = "Smart connected watch models" }
            );

            modelBuilder.Entity<Manufacturer>().HasData(
                new Manufacturer { Id = 1, Name = "Rolex", Description = "Swiss luxury watch brand" },
                new Manufacturer { Id = 2, Name = "Omega", Description = "Swiss premium watchmaker" },
                new Manufacturer { Id = 3, Name = "Seiko", Description = "Japanese watch manufacturer" }
            );

            modelBuilder.Entity<ProductColor>().HasData(
                new ProductColor { Id = 1, Name = "Black" },
                new ProductColor { Id = 2, Name = "White" },
                new ProductColor { Id = 3, Name = "Blue" }
            );

            modelBuilder.Entity<ProductSize>().HasData(
                new ProductSize { Id = 1, Name = "S" },
                new ProductSize { Id = 2, Name = "M" },
                new ProductSize { Id = 3, Name = "L" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Rolex Submariner Date",
                    Price = 285000000,
                    Stock = 6,
                    CategoryId = 1,
                    ProductTypeId = 1,
                    ManufacturerId = 1,
                    ColorId = 1,
                    SizeId = 3,
                    Description = "Iconic dive watch with automatic movement",
                    ImageUrl = ""
                },
                new Product
                {
                    Id = 2,
                    Name = "Omega Speedmaster Moonwatch",
                    Price = 198000000,
                    Stock = 8,
                    CategoryId = 2,
                    ProductTypeId = 2,
                    ManufacturerId = 2,
                    ColorId = 2,
                    SizeId = 2,
                    Description = "Legendary chronograph with classic design",
                    ImageUrl = ""
                },
                new Product
                {
                    Id = 3,
                    Name = "Seiko 5 Sports GMT",
                    Price = 12500000,
                    Stock = 18,
                    CategoryId = 2,
                    ProductTypeId = 3,
                    ManufacturerId = 3,
                    ColorId = 1,
                    SizeId = 2,
                    Description = "Daily sport watch with GMT function",
                    ImageUrl = ""
                },
                new Product
                {
                    Id = 4,
                    Name = "Apple Watch Series 10",
                    Price = 12990000,
                    Stock = 20,
                    CategoryId = 3,
                    ProductTypeId = 3,
                    ManufacturerId = 2,
                    ColorId = 3,
                    SizeId = 1,
                    Description = "Smartwatch with health and fitness tracking",
                    ImageUrl = ""
                },
                new Product
                {
                    Id = 5,
                    Name = "Leather Watch Strap 20mm",
                    Price = 890000,
                    Stock = 40,
                    CategoryId = 5,
                    ProductTypeId = 3,
                    ManufacturerId = 3,
                    ColorId = 2,
                    SizeId = 1,
                    Description = "Premium genuine leather replacement strap",
                    ImageUrl = ""
                }
            );

            // Note: Users are managed by AuthService (MySQL)
            // Admin seed user is handled in BaseCore.AuthService startup
        }
    }
}
