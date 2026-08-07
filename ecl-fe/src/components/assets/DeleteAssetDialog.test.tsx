import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithLocale } from "@/test-utils/render-with-locale"
import { DeleteAssetDialog } from "./DeleteAssetDialog"

describe("DeleteAssetDialog", () => {
  it("is closed by default", () => {
    renderWithLocale(<DeleteAssetDialog assetName="Production Server" onConfirm={jest.fn()} />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens and shows translated confirmation copy in Spanish", async () => {
    const user = userEvent.setup()
    renderWithLocale(<DeleteAssetDialog assetName="Production Server" onConfirm={jest.fn()} />)

    await user.click(screen.getByRole("button", { name: "Eliminar Production Server" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("¿Eliminar asset?")).toBeInTheDocument()
    expect(
      screen.getByText("¿Estás seguro que querés eliminar Production Server?")
    ).toBeInTheDocument()
  })

  it("opens and shows translated confirmation copy in English", async () => {
    const user = userEvent.setup()
    renderWithLocale(
      <DeleteAssetDialog assetName="Production Server" onConfirm={jest.fn()} />,
      "en"
    )

    await user.click(screen.getByRole("button", { name: "Delete Production Server" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Delete asset?")).toBeInTheDocument()
    expect(screen.getByText("Are you sure you want to delete Production Server?")).toBeInTheDocument()
  })
})
