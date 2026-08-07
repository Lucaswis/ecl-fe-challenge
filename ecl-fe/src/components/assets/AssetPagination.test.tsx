import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetPagination } from "./AssetPagination"

describe("AssetPagination", () => {
  it("shows the current page and total pages", () => {
    renderWithLocale(<AssetPagination page={2} totalPages={3} onPrev={jest.fn()} onNext={jest.fn()} />)

    expect(screen.getByText("Página 2 de 3")).toBeInTheDocument()
  })

  it("calls onNext and onPrev when the buttons are clicked", async () => {
    const user = userEvent.setup()
    const onPrev = jest.fn()
    const onNext = jest.fn()
    renderWithLocale(<AssetPagination page={2} totalPages={3} onPrev={onPrev} onNext={onNext} />)

    await user.click(screen.getByRole("button", { name: "Anterior" }))
    await user.click(screen.getByRole("button", { name: "Siguiente" }))

    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("disables Anterior on the first page and Siguiente on the last page", () => {
    renderWithLocale(<AssetPagination page={1} totalPages={1} onPrev={jest.fn()} onNext={jest.fn()} />)

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled()
  })

  it("renders translated copy in English", () => {
    renderWithLocale(<AssetPagination page={2} totalPages={3} onPrev={jest.fn()} onNext={jest.fn()} />, "en")

    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })
})
