using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace AuthServer.Swagger
{
    public class SwaggerExampleSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            // Only add examples for DTOs
            if (context.Type.Namespace?.Contains("DTOs") != true)
            {
                return;
            }
            
            // Login Request example
            if (context.Type.Name == "LoginRequestDto")
            {
                schema.Example = new OpenApiObject
                {
                    ["email"] = new OpenApiString("test@example.com"),
                    ["password"] = new OpenApiString("password123")
                };
            }
            
            // Validate Request example
            else if (context.Type.Name == "ValidateRequestDto")
            {
                schema.Example = new OpenApiObject
                {
                    ["email"] = new OpenApiString("test@example.com")
                };
            }
            
            // Auth Response example
            else if (context.Type.Name == "AuthResponseDto")
            {
                schema.Example = new OpenApiObject
                {
                    ["success"] = new OpenApiBoolean(true),
                    ["user"] = new OpenApiObject
                    {
                        ["id"] = new OpenApiInteger(1),
                        ["email"] = new OpenApiString("test@example.com"),
                        ["name"] = new OpenApiString("Test User"),
                        ["lastLoginAt"] = new OpenApiDateTime(DateTime.UtcNow)
                    },
                    ["error"] = new OpenApiNull()
                };
            }
            
            // UserDto example
            else if (context.Type.Name == "UserDto")
            {
                schema.Example = new OpenApiObject
                {
                    ["id"] = new OpenApiInteger(1),
                    ["email"] = new OpenApiString("test@example.com"),
                    ["name"] = new OpenApiString("Test User"),
                    ["lastLoginAt"] = new OpenApiDateTime(DateTime.UtcNow)
                };
            }
        }
    }
} 