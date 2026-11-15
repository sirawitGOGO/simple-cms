using System.Security.Claims;
using CmsApi.DTOs;
using CmsApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CmsApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _postService;

    public PostController(PostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PostDto>>> GetAll()
    {
        return Ok(await _postService.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostDto>> GetById(Guid id)
    {
        var post = await _postService.GetByIdAsync(id);
        return post is null ? NotFound() : Ok(post);
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> Create(CreatePostDto dto)
    {
        var userIdClaim = User.FindFirstValue("UserId")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var post = await _postService.CreateAsync(dto, userId);
        if (post is null)
        {
            return Unauthorized();
        }

        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PostDto>> Update(Guid id, UpdatePostDto dto)
    {
        var post = await _postService.UpdateAsync(id, dto);
        return post is null ? NotFound() : Ok(post);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _postService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
