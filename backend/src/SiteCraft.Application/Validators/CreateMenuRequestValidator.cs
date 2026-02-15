using FluentValidation;
using SiteCraft.Application.DTOs.Menus;

namespace SiteCraft.Application.Validators;

public class CreateMenuRequestValidator : AbstractValidator<CreateMenuRequest>
{
    public CreateMenuRequestValidator()
    {
        RuleFor(x => x.SiteId)
            .NotEmpty().WithMessage("Site ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Menu name is required")
            .MaximumLength(100).WithMessage("Menu name must not exceed 100 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Menu location is required")
            .Must(loc => loc == "Header" || loc == "Footer")
            .WithMessage("Menu location must be either 'Header' or 'Footer'");
    }
}
