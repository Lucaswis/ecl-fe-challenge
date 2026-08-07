import { createAssetFormReducer, initialCreateAssetFormState } from "./use-create-asset-form"

describe("createAssetFormReducer", () => {
  it("addComponent appends one draft with a fresh key", () => {
    const state = createAssetFormReducer(initialCreateAssetFormState, { type: "addComponent" })

    expect(state.components).toHaveLength(1)
    expect(state.components[0].key).toBeTruthy()
    expect(state.components[0]).toMatchObject({ name: "", version: "", vendor: "", type: "" })
  })

  it("removeComponent drops only the matching row, keeping the others' keys stable", () => {
    const withTwoRows = createAssetFormReducer(
      createAssetFormReducer(initialCreateAssetFormState, { type: "addComponent" }),
      { type: "addComponent" }
    )
    const [first, second] = withTwoRows.components

    const state = createAssetFormReducer(withTwoRows, { type: "removeComponent", key: first.key })

    expect(state.components).toHaveLength(1)
    expect(state.components[0].key).toBe(second.key)
  })

  it("setComponentField updates only the targeted row, leaving siblings untouched", () => {
    const withTwoRows = createAssetFormReducer(
      createAssetFormReducer(initialCreateAssetFormState, { type: "addComponent" }),
      { type: "addComponent" }
    )
    const [first, second] = withTwoRows.components

    const state = createAssetFormReducer(withTwoRows, {
      type: "setComponentField",
      key: first.key,
      field: "name",
      value: "nginx",
    })

    expect(state.components[0]).toMatchObject({ key: first.key, name: "nginx" })
    expect(state.components[1]).toEqual(second)
  })
})

describe("createAssetFormReducer — vulnerabilities", () => {
  it("addVulnerability appends one draft with a fresh key", () => {
    const state = createAssetFormReducer(initialCreateAssetFormState, { type: "addVulnerability" })

    expect(state.vulnerabilities).toHaveLength(1)
    expect(state.vulnerabilities[0].key).toBeTruthy()
    expect(state.vulnerabilities[0]).toMatchObject({ description: "" })
  })

  it("removeVulnerability drops only the matching row, keeping the others' keys stable", () => {
    const withTwoRows = createAssetFormReducer(
      createAssetFormReducer(initialCreateAssetFormState, { type: "addVulnerability" }),
      { type: "addVulnerability" }
    )
    const [first, second] = withTwoRows.vulnerabilities

    const state = createAssetFormReducer(withTwoRows, { type: "removeVulnerability", key: first.key })

    expect(state.vulnerabilities).toHaveLength(1)
    expect(state.vulnerabilities[0].key).toBe(second.key)
  })

  it("setVulnerabilityField updates only the targeted row, leaving siblings untouched", () => {
    const withTwoRows = createAssetFormReducer(
      createAssetFormReducer(initialCreateAssetFormState, { type: "addVulnerability" }),
      { type: "addVulnerability" }
    )
    const [first, second] = withTwoRows.vulnerabilities

    const state = createAssetFormReducer(withTwoRows, {
      type: "setVulnerabilityField",
      key: first.key,
      field: "severity",
      value: "CRITICAL",
    })

    expect(state.vulnerabilities[0]).toMatchObject({ key: first.key, severity: "CRITICAL" })
    expect(state.vulnerabilities[1]).toEqual(second)
  })
})

describe("createAssetFormReducer — base fields and reset", () => {
  it("setField updates name and description independently", () => {
    const withName = createAssetFormReducer(initialCreateAssetFormState, {
      type: "setField",
      field: "name",
      value: "Production Server",
    })
    const state = createAssetFormReducer(withName, {
      type: "setField",
      field: "description",
      value: "Main backend server",
    })

    expect(state.name).toBe("Production Server")
    expect(state.description).toBe("Main backend server")
  })

  it("reset returns to the initial state, discarding rows and field values", () => {
    const dirty = createAssetFormReducer(
      createAssetFormReducer(initialCreateAssetFormState, { type: "setField", field: "name", value: "x" }),
      { type: "addComponent" }
    )

    const state = createAssetFormReducer(dirty, { type: "reset" })

    expect(state).toEqual(initialCreateAssetFormState)
  })
})
