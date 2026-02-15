using FluentValidation;
using SiteCraft.Application.DTOs.Menus;

namespace SiteCraft.Application.Validators;

public class UpdateMenuRequestValidator : AbstractValidator<UpdateMenuRequest>
{
    public UpdateMenuRequestValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Menu name must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Location)
            .Must(loc => loc == "Header" || loc == "Footer")
            .WithMessage("Menu location must be either 'Header' or 'Footer'")
            .When(x => !string.IsNullOrEmpty(x.Location));
    }
}
