namespace SiteCraft.Domain.Enums;

/// <summary>
/// Status of a project in its lifecycle
/// </summary>
public enum ProjectStatus
{
    /// <summary>
    /// Project is in draft state - not published
    /// </summary>
    Draft = 0,
    
    /// <summary>
    /// Project is active and being worked on
    /// </summary>
    Active = 1,
    
    /// <summary>
    /// Project is published and live
    /// </summary>
    Published = 2,
    
    /// <summary>
    /// Project is archived - no longer active
    /// </summary>
    Archived = 3
}
