using CmsApi.Data;
using CmsApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CmsApi.Services;

public class AuthService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthService(ApplicationDbContext dbContext, IPasswordHasher<User> passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task<User?> RegisterAsync(string username, string password)
    {
        var normalizedUsername = username.Trim();
        if (await _dbContext.Users.AnyAsync(user => user.Username == normalizedUsername))
        {
            return null;
        }

        var user = new User { Username = normalizedUsername };
        user.PasswordHash = _passwordHasher.HashPassword(user, password);
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<User?> ValidateCredentialsAsync(string username, string password)
    {
        var normalizedUsername = username.Trim();
        var user = await _dbContext.Users
            .SingleOrDefaultAsync(candidate => candidate.Username == normalizedUsername);

        if (user is null)
        {
            return null;
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        return result == PasswordVerificationResult.Failed ? null : user;
    }
}
