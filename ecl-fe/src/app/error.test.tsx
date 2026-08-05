import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ErrorBoundary from "./error"

describe("error.tsx", () => {
  it("renders an error message", () => {
    render(<ErrorBoundary error={new Error("boom")} retry={jest.fn()} />)

    expect(
      screen.getByRole("heading", { name: "No pudimos conectar con el backend" })
    ).toBeInTheDocument()
  })

  it("invokes the retry prop when clicking Reintentar", async () => {
    const retry = jest.fn()
    const user = userEvent.setup()
    render(<ErrorBoundary error={new Error("boom")} retry={retry} />)

    await user.click(screen.getByRole("button", { name: "Reintentar" }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
