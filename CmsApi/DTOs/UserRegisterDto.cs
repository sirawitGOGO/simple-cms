using System.ComponentModel.DataAnnotations;

namespace CmsApi.DTOs;

public class UserRegisterDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(128, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}
