using Microsoft.EntityFrameworkCore;
using ECommerce.Shared.Data;
using ECommerce.Shared.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddGlobalExceptionHandling();

// Add CORS for React client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactClient", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000") // React dev server
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
    
    // For development - allow all origins
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "ECommerce API", 
        Version = "v1",
        Description = "E-Commerce Web API for React Client"
    });
});

// Add Entity Framework
builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add ECommerce services (repositories, Unit of Work, business services)
builder.Services.AddECommerceServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ECommerce API V1");
        c.RoutePrefix = "api-docs"; // Swagger UI available at /api-docs
    });
}

app.UseGlobalExceptionHandling();
app.UseHttpsRedirection();

// Use React-specific CORS in development, AllowAll in production for now
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReactClient");
}
else
{
    app.UseCors("AllowAll");
}

app.UseAuthorization();

app.MapControllers();

app.Run();
