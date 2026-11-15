using System.ComponentModel.DataAnnotations;

namespace CmsApi.DTOs;

public class UpdatePostDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;
}
