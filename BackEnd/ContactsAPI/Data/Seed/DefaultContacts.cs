using Domain.Entities;

namespace Data.Seed;

public static class DefaultContacts
{
    public static List<Contact> ContactList()
    {
        List<Contact> contacts = new();
        for (int i = 1; i <= 1000; i++)
        {
            contacts.Add(new Contact
            {
                Id = i,
                FirstName = $"FirstName{i}",
                LastName = $"LastName{i}",
                Email = $"user{i}@example.com",
                DateOfBirth = new DateTime(1980, 1, 1).AddDays(i),
                PhoneNumber = $"555-{100 + (i / 100):D3}-{i % 1000:D4}", // e.g., 555-101-0023
                ContactAddress = new Address
                {
                    Street = $"{i} Main St",
                    City = "Gotham",
                    State = "NY",
                    PostalCode = $"{10000 + i}",
                    Country = "USA"
                }
            });
        }

        return contacts;
    }
}

