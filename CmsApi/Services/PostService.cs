using CmsApi.Data;
using CmsApi.DTOs;
using CmsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CmsApi.Services;

public class PostService
{
    private readonly ApplicationDbContext _dbContext;

    public PostService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<PostDto>> GetAllAsync()
    {
        return await _dbContext.Posts
            .AsNoTracking()
            .OrderByDescending(post => post.CreatedAt)
            .Select(post => ToDto(post))
            .ToListAsync();
    }

    public async Task<PostDto?> GetByIdAsync(Guid id)
    {
        var post = await _dbContext.Posts.AsNoTracking()
            .SingleOrDefaultAsync(post => post.Id == id);
        return post is null ? null : ToDto(post);
    }

    public async Task<PostDto?> CreateAsync(CreatePostDto dto, Guid userId)
    {
        if (!await _dbContext.Users.AnyAsync(user => user.Id == userId))
        {
            return null;
        }

        var post = new Post
        {
            Title = dto.Title.Trim(),
            Content = dto.Content,
            UserId = userId
        };

        _dbContext.Posts.Add(post);
        await _dbContext.SaveChangesAsync();
        return ToDto(post);
    }

    public async Task<PostDto?> UpdateAsync(Guid id, UpdatePostDto dto, Guid userId)
    {
        var post = await _dbContext.Posts
            .SingleOrDefaultAsync(post => post.Id == id && post.UserId == userId);
        if (post is null)
        {
            return null;
        }

        post.Title = dto.Title.Trim();
        post.Content = dto.Content;
        await _dbContext.SaveChangesAsync();
        return ToDto(post);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var post = await _dbContext.Posts
            .SingleOrDefaultAsync(post => post.Id == id && post.UserId == userId);
        if (post is null)
        {
            return false;
        }

        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static PostDto ToDto(Post post) => new()
    {
        Id = post.Id,
        Title = post.Title,
        Content = post.Content,
        CreatedAt = post.CreatedAt,
        UserId = post.UserId
    };
}
