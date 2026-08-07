import { createAssetFormReducer, initialCreateAssetFormState } from "./use-create-asset-form"

describe("createAssetFormReducer", () => {
  it("addComponent appends one draft with a fresh key", () => {
    const state = createAssetFormReducer(initialCreateAssetFormState, { type: "addComponent" })

    expect(state.components).toHaveLength(1)
    expect(state.components[0].key).toBeTruthy()
    expect(state.components[0]).toMatchObject({ name: "", version: "", vendor: "", type: "" })
  })
})
