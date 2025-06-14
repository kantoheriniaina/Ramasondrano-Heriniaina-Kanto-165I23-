using WebApplication1.Data;
using WebApplication1.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// ➕ Ajouter le DbContext PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ➕ Ajouter les services personnalisés
builder.Services.AddScoped<IVoitureService, VoitureService>();

// ➕ Ajouter les contrôleurs
builder.Services.AddControllers();

// ➕ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ➕ Configurer CORS pour autoriser Next.js (http://localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy => policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// ➕ Swagger en dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ➕ Appliquer la politique CORS
app.UseCors("AllowNextJs");

// 🔐 HTTPS et routing
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();