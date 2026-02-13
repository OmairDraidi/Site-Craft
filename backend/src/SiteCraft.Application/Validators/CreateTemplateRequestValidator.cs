using FluentValidation;
using SiteCraft.Application.DTOs.Templates;
using System.Text.Json;

namespace SiteCraft.Application.Validators;

public class CreateTemplateRequestValidator : AbstractValidator<CreateTemplateRequest>
{
    public CreateTemplateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Template name is required")
            .MaximumLength(200).WithMessage("Template name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .Must(BeValidCategory).WithMessage("Invalid category. Valid categories: Business, Education, Portfolio, Services, Store");

        RuleFor(x => x.PreviewImageUrl)
            .NotEmpty().WithMessage("Preview image URL is required")
            .Must(BeValidUrl).WithMessage("Preview image URL must be a valid URL");

        RuleFor(x => x.TemplateData)
            .NotEmpty().WithMessage("Template data is required")
            .Must(BeValidJson).WithMessage("Template data must be valid JSON");
    }

    private bool BeValidCategory(string category)
    {
        var validCategories = new[] { "Business", "Education", "Portfolio", "Services", "Store" };
        return validCategories.Contains(category, StringComparer.OrdinalIgnoreCase);
    }

    private bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private bool BeValidJson(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return false;

        try
        {
            using var document = JsonDocument.Parse(json);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
