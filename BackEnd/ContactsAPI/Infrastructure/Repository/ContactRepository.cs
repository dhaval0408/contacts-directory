using Data;
using Domain.Entities;
using Domain.ViewModels;
using Infrastructure.Interface;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Repository;

public class ContactRepository : IContactRepository
{
    private readonly ApplicationDbContext _context;
    public ContactRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContactListResponse> GetAllAsync(BaseSearch request)
    {
        IEnumerable<Contact> contacts = await _context.Contacts.ToListAsync();

        // searching
        if (!string.IsNullOrWhiteSpace(request.KeywordSearch))
        {
            contacts = contacts.Where(c => c.FirstName.Contains(request.KeywordSearch, StringComparison.OrdinalIgnoreCase)
                                                    || c.LastName.Contains(request.KeywordSearch, StringComparison.OrdinalIgnoreCase)
                                                    || c.Email.Contains(request.KeywordSearch, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.SortBy))
        {
            var propertyInfo = typeof(Contact).GetProperty(request.SortBy.Trim(), BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) ?? throw new ArgumentException($"Property {request.SortBy} does not exist on Contact");

            // Use LINQ dynamic ordering
            Func<Contact, object?> keySelector = x => propertyInfo.GetValue(x);

            // Perform sorting based on the sort order
            contacts = request.SortOrder == "asc"
                ? contacts.OrderBy(keySelector).ToList()
                : contacts.OrderByDescending(keySelector).ToList();
        }

        // count total records before applying pagination. total count will be used in UI for pagination 
        ContactListResponse response = new()
        {
            TotalRows = contacts.Count()
        };

        //paging
        contacts = contacts.Skip(request.Offset).Take(request.PageSize);

        response.Contacts = contacts;
        return response;
    }

    public async Task<Contact?> GetByIdAsync(int id)
    {
        return await _context.Contacts.FindAsync(id);
    }

    public async Task AddAsync(Contact contact)
    {
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Contact contact)
    {
         _context.Contacts.Update(contact);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        Contact? contact = await GetByIdAsync(id);
        if (contact is not null)
        {
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
        }
    }
}
