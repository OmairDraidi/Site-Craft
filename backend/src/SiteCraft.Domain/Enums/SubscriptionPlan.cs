namespace SiteCraft.Domain.Enums;

/// <summary>
/// Subscription plans available for tenants
/// </summary>
public enum SubscriptionPlan
{
    /// <summary>
    /// Free plan with basic features
    /// </summary>
    Free = 1,
    
    /// <summary>
    /// Pro plan with premium templates and advanced features
    /// </summary>
    Pro = 2,
    
    /// <summary>
    /// Enterprise plan with all features and priority support
    /// </summary>
    Enterprise = 3
}
