using Domain.Entities;
using Domain.ViewModels;
using System.Linq.Expressions;

namespace Service.Interface;

public interface IContactService
{
    Task<ContactListResponse> GetAllAsync(BaseSearch request);

    Task<Contact?> GetByIdAsync(int id);

    // Task<IEnumerable<Contact>> SearchAsync(string keyword);

    Task AddAsync(Contact contact);

    Task UpdateAsync(Contact contact);

    Task DeleteAsync(int id);
}

