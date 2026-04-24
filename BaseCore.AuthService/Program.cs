using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using BaseCore.Common;
using BaseCore.Entities;
using BaseCore.Repository;
using BaseCore.Repository.Authen;
using BaseCore.Services.Authen;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BaseCore Auth Service API",
        Version = "v1",
        Description = "Authentication Microservice - Login, Register, User Management (Bài 10, 11)"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

// MySQL Configuration
var connectionString = builder.Configuration.GetConnectionString("MySQL")
    ?? "Server=localhost;Port=3306;Database=basecoresales;User=root;Password=Ab12345@;";
builder.Services.AddDbContext<MySqlDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// DI for Authentication Services and Repositories only
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// JWT Authentication Key
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? "YourSecretKeyForAuthenticationShouldBeLongEnough");
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// Seed admin user in MySQL
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MySqlDbContext>();
    dbContext.Database.EnsureCreated();

    var existingAdmin = await dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "admin");
    if (existingAdmin == null)
    {
        byte[] salt;
        var hashedPassword = TokenHelper.HashPassword("admin123", out salt);

        var adminUser = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "admin",
            Password = hashedPassword,
            Salt = salt,
            Name = "Administrator",
            Email = "admin@basecore.local",
            Phone = "0123456789",
            Position = "System Administrator",
            Contact = string.Empty,
            Image = string.Empty,
            IsActive = true,
            UserType = 1,
            Created = DateTime.Now
        };

        dbContext.Users.Add(adminUser);
        await dbContext.SaveChangesAsync();
    }
    else if (existingAdmin.Salt == null || existingAdmin.Salt.Length == 0)
    {
        byte[] salt;
        var hashedPassword = TokenHelper.HashPassword("admin123", out salt);
        existingAdmin.Password = hashedPassword;
        existingAdmin.Salt = salt;
        existingAdmin.IsActive = true;
        await dbContext.SaveChangesAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("BaseCore Auth Service running on port 5002");
Console.WriteLine("Endpoints: /api/auth, /api/users, /api/roles");
app.Run();
