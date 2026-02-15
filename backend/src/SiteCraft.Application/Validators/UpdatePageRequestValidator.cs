using FluentValidation;
using SiteCraft.Application.DTOs.Pages;

namespace SiteCraft.Application.Validators;

public class UpdatePageRequestValidator : AbstractValidator<UpdatePageRequest>
{
    public UpdatePageRequestValidator()
    {
        // Title is optional for updates, but if provided must meet criteria
        When(x => !string.IsNullOrWhiteSpace(x.Title), () =>
        {
            RuleFor(x => x.Title)
                .MaximumLength(200).WithMessage("Page title must not exceed 200 characters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.MetaDescription), () =>
        {
            RuleFor(x => x.MetaDescription)
                .MaximumLength(300).WithMessage("Meta description must not exceed 300 characters");
        });

        When(x => !string.IsNullOrWhiteSpace(x.MetaKeywords), () =>
        {
            RuleFor(x => x.MetaKeywords)
                .MaximumLength(500).WithMessage("Meta keywords must not exceed 500 characters");
        });
    }
}
