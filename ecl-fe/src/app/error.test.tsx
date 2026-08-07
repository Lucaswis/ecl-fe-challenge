import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import ErrorBoundary from "./error"

describe("error.tsx", () => {
  it("renders an error message", () => {
    renderWithLocale(<ErrorBoundary error={new Error("boom")} retry={jest.fn()} />)

    expect(
      screen.getByRole("heading", { name: "No pudimos conectar con el backend" })
    ).toBeInTheDocument()
  })

  it("invokes the retry prop when clicking Reintentar", async () => {
    const retry = jest.fn()
    const user = userEvent.setup()
    renderWithLocale(<ErrorBoundary error={new Error("boom")} retry={retry} />)

    await user.click(screen.getByRole("button", { name: "Reintentar" }))

    expect(retry).toHaveBeenCalledTimes(1)
  })

  it("renders translated copy in English", () => {
    renderWithLocale(<ErrorBoundary error={new Error("boom")} retry={jest.fn()} />, "en")

    expect(
      screen.getByRole("heading", { name: "We couldn't connect to the backend" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
    expect(screen.getByText(/Is/)).toBeInTheDocument()
  })
})
