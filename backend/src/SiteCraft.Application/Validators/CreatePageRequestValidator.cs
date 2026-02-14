using FluentValidation;
using SiteCraft.Application.DTOs.Pages;

namespace SiteCraft.Application.Validators;

public class CreatePageRequestValidator : AbstractValidator<CreatePageRequest>
{
    public CreatePageRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Page title is required")
            .MaximumLength(200).WithMessage("Page title must not exceed 200 characters");

        RuleFor(x => x.SiteId)
            .NotEmpty().WithMessage("Site ID is required");

        RuleFor(x => x.MetaDescription)
            .MaximumLength(300).WithMessage("Meta description must not exceed 300 characters");

        RuleFor(x => x.MetaKeywords)
            .MaximumLength(500).WithMessage("Meta keywords must not exceed 500 characters");
    }
}
