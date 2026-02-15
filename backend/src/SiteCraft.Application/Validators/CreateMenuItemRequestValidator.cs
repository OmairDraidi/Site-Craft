using FluentValidation;
using SiteCraft.Application.DTOs.Menus;

namespace SiteCraft.Application.Validators;

public class CreateMenuItemRequestValidator : AbstractValidator<CreateMenuItemRequest>
{
    public CreateMenuItemRequestValidator()
    {
        RuleFor(x => x.MenuId)
            .NotEmpty().WithMessage("Menu ID is required");

        RuleFor(x => x.Label)
            .NotEmpty().WithMessage("Menu item label is required")
            .MaximumLength(100).WithMessage("Menu item label must not exceed 100 characters");

        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("Menu item URL is required")
            .MaximumLength(500).WithMessage("Menu item URL must not exceed 500 characters");

        RuleFor(x => x.Target)
            .Must(target => target == "_self" || target == "_blank")
            .WithMessage("Target must be either '_self' or '_blank'")
            .When(x => !string.IsNullOrEmpty(x.Target));
    }
}
