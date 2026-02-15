using FluentValidation;
using SiteCraft.Application.DTOs.Menus;

namespace SiteCraft.Application.Validators;

public class UpdateMenuItemRequestValidator : AbstractValidator<UpdateMenuItemRequest>
{
    public UpdateMenuItemRequestValidator()
    {
        RuleFor(x => x.Label)
            .MaximumLength(100).WithMessage("Menu item label must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Label));

        RuleFor(x => x.Url)
            .MaximumLength(500).WithMessage("Menu item URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Url));

        RuleFor(x => x.Target)
            .Must(target => target == "_self" || target == "_blank")
            .WithMessage("Target must be either '_self' or '_blank'")
            .When(x => !string.IsNullOrEmpty(x.Target));
    }
}
