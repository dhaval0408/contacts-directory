using Domain.Entities;
using Domain.ViewModels;

namespace Infrastructure.Interface;

public interface IContactRepository
{
    Task<ContactListResponse> GetAllAsync(BaseSearch request);

    Task<Contact?> GetByIdAsync(int id);

    Task AddAsync(Contact contact);

    Task UpdateAsync(Contact contact);

    Task DeleteAsync(int id);
}

