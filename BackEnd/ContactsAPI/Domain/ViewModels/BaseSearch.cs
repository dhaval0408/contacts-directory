namespace Domain.ViewModels;

public class BaseSearch
{
    public int PageNo { get; set; }

    public int PageSize { get; set; }

    public string SortOrder { get; set; }

    public string SortBy { get; set; }

    public int Offset => PageNo * PageSize;

    public string KeywordSearch { get; set; }
}
