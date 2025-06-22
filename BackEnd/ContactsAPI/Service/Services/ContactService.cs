using Domain.Entities;
using Domain.ViewModels;
using Infrastructure.Interface;
using Service.Interface;

namespace Service.Services;

public class ContactService : IContactService
{
    private readonly IContactRepository _contactRepository;

    public ContactService(IContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<Contact?> GetByIdAsync(int id)
    {
        return await _contactRepository.GetByIdAsync(id);
    }

    public async Task<ContactListResponse> GetAllAsync(BaseSearch request)
    {
        return await _contactRepository.GetAllAsync(request);
    }

    public async Task AddAsync(Contact contact)
    {
        await _contactRepository.AddAsync(contact);
    }

    public async Task UpdateAsync(Contact contact)
    {
        await _contactRepository.UpdateAsync(contact);
    }

    public async Task DeleteAsync(int id)
    {
        await _contactRepository.DeleteAsync(id);
    }
}

