using Domain.Entities;

namespace Domain.ViewModels;

public class ContactListResponse
{
    public IEnumerable<Contact> Contacts { get; set; }

    public int TotalRows { get; set; }
}
