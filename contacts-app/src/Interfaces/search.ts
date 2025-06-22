export interface ISearch {
  pageNo: number
  pageSize: number
  sortOrder: 'asc' | 'desc'
  sortBy: string
  keywordSearch: string
}