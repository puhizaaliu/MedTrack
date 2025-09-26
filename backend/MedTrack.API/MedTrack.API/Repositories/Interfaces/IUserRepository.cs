using MedTrack.API.Models; 
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByEmailAsync(string email); // për login 
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task DeleteUserAsync(int id);

    Task<IEnumerable<User>> GetByRoleAsync(UserRole role);

}
