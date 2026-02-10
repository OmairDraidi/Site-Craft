# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY SiteCraft.sln ./
COPY src/SiteCraft.API/SiteCraft.API.csproj src/SiteCraft.API/
COPY src/SiteCraft.Application/SiteCraft.Application.csproj src/SiteCraft.Application/
COPY src/SiteCraft.Domain/SiteCraft.Domain.csproj src/SiteCraft.Domain/
COPY src/SiteCraft.Infrastructure/SiteCraft.Infrastructure.csproj src/SiteCraft.Infrastructure/
COPY tests/SiteCraft.UnitTests/SiteCraft.UnitTests.csproj tests/SiteCraft.UnitTests/
COPY tests/SiteCraft.IntegrationTests/SiteCraft.IntegrationTests.csproj tests/SiteCraft.IntegrationTests/

# Restore dependencies
RUN dotnet restore

# Copy everything else
COPY . .

# Build the application
WORKDIR /src/src/SiteCraft.API
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "SiteCraft.API.dll"]
