import { paginate, totalPagesOf } from "./paginate"

describe("paginate", () => {
  it("returns the first page when the count is an exact multiple of pageSize", () => {
    const items = [1, 2, 3, 4, 5, 6]

    expect(paginate(items, 1, 3)).toEqual([1, 2, 3])
    expect(paginate(items, 2, 3)).toEqual([4, 5, 6])
  })

  it("returns a partial last page", () => {
    const items = [1, 2, 3, 4, 5]

    expect(paginate(items, 2, 3)).toEqual([4, 5])
  })

  it("returns an empty array for a page beyond the range", () => {
    const items = [1, 2, 3]

    expect(paginate(items, 5, 3)).toEqual([])
  })

  it("returns the whole list on page 1 when there are fewer items than pageSize", () => {
    const items: number[] = []

    expect(paginate(items, 1, 10)).toEqual([])
  })
})

describe("totalPagesOf", () => {
  it("rounds up when the count does not divide evenly", () => {
    expect(totalPagesOf(13, 10)).toBe(2)
  })

  it("returns 1 for an exact multiple", () => {
    expect(totalPagesOf(6, 3)).toBe(2)
    expect(totalPagesOf(9, 3)).toBe(3)
  })

  it("returns 1 when there are no items", () => {
    expect(totalPagesOf(0, 10)).toBe(1)
  })
})
