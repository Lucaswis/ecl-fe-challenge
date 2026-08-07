import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithLocale } from "@/test-utils/render-with-locale"
import { CreateAssetDialog } from "./CreateAssetDialog"

describe("CreateAssetDialog", () => {
  it("renders closed by default with a trigger button", () => {
    renderWithLocale(<CreateAssetDialog onCreate={jest.fn()} />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Agregar asset" })).toBeInTheDocument()
  })

  it("opening the dialog shows the base asset fields", async () => {
    const user = userEvent.setup()
    renderWithLocale(<CreateAssetDialog onCreate={jest.fn()} />)

    await user.click(screen.getByRole("button", { name: "Agregar asset" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument()
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument()
  })

  it("adding two component rows then removing the first leaves the second row's data", async () => {
    const user = userEvent.setup()
    renderWithLocale(<CreateAssetDialog onCreate={jest.fn()} />)
    await user.click(screen.getByRole("button", { name: "Agregar asset" }))

    await user.click(screen.getByRole("button", { name: "Agregar componente" }))
    await user.click(screen.getByRole("button", { name: "Agregar componente" }))

    const [firstRow, secondRow] = screen.getAllByTestId("component-draft-row")
    await user.type(within(firstRow).getByLabelText("Nombre"), "nginx")
    await user.type(within(secondRow).getByLabelText("Nombre"), "openssl")

    await user.click(within(firstRow).getByRole("button", { name: "Quitar componente" }))

    const remaining = screen.getAllByTestId("component-draft-row")
    expect(remaining).toHaveLength(1)
    expect(within(remaining[0]).getByLabelText("Nombre")).toHaveValue("openssl")
  })

  it("adding a vulnerability row renders its description and severity fields", async () => {
    const user = userEvent.setup()
    renderWithLocale(<CreateAssetDialog onCreate={jest.fn()} />)
    await user.click(screen.getByRole("button", { name: "Agregar asset" }))

    await user.click(screen.getByRole("button", { name: "Agregar vulnerabilidad" }))

    const row = screen.getByTestId("vulnerability-draft-row")
    expect(within(row).getByLabelText("Descripción")).toBeInTheDocument()
    expect(within(row).getByLabelText("Severidad")).toBeInTheDocument()
  })

  it("submits the assembled nested shape with 2 component rows and 1 vulnerability row", async () => {
    const user = userEvent.setup()
    const onCreate = jest.fn()
    renderWithLocale(<CreateAssetDialog onCreate={onCreate} />)
    await user.click(screen.getByRole("button", { name: "Agregar asset" }))

    await user.type(screen.getByLabelText("Nombre"), "Production Server")
    await user.type(screen.getByLabelText("Descripción"), "Main backend server")

    await user.click(screen.getByRole("button", { name: "Agregar componente" }))
    await user.click(screen.getByRole("button", { name: "Agregar componente" }))
    const [firstComponent, secondComponent] = screen.getAllByTestId("component-draft-row")
    await user.type(within(firstComponent).getByLabelText("Nombre"), "nginx")
    await user.type(within(secondComponent).getByLabelText("Nombre"), "openssl")

    await user.click(screen.getByRole("button", { name: "Agregar vulnerabilidad" }))
    const vulnerabilityRow = screen.getByTestId("vulnerability-draft-row")
    await user.type(within(vulnerabilityRow).getByLabelText("Descripción"), "Outdated TLS")

    await user.click(screen.getByRole("button", { name: "Crear" }))

    expect(onCreate).toHaveBeenCalledTimes(1)
    const created = onCreate.mock.calls[0][0]
    expect(created.name).toBe("Production Server")
    expect(created.description).toBe("Main backend server")
    expect(created.components).toHaveLength(2)
    expect(created.components[0].name).toBe("nginx")
    expect(created.components[1].name).toBe("openssl")
    expect(created.vulnerabilities).toHaveLength(1)
    expect(created.vulnerabilities[0].description).toBe("Outdated TLS")
    expect(created.vulnerabilities[0].severity).toBe("LOW")
  })

  it("renders translated copy in English", async () => {
    const user = userEvent.setup()
    renderWithLocale(<CreateAssetDialog onCreate={jest.fn()} />, "en")

    expect(screen.getByRole("button", { name: "Add asset" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Add asset" }))

    expect(screen.getByText("Create asset")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add component" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add vulnerability" })).toBeInTheDocument()
  })
})
