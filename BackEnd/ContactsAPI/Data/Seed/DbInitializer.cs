namespace Data.Seed;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        if (context.Contacts.Any()) return;
        context.Contacts.AddRangeAsync(DefaultContacts.ContactList());
        context.SaveChanges();
    }
}

