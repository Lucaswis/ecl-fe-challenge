import { useReducer } from "react"

import type { ComponentDraft, CreateAssetFormState } from "@/lib/assets/types"

export type ComponentDraftField = "name" | "version" | "vendor" | "type"
export type VulnerabilityDraftField = "description" | "severity"

export type CreateAssetFormAction =
  | { type: "setField"; field: "name" | "description"; value: string }
  | { type: "addComponent" }
  | { type: "removeComponent"; key: string }
  | { type: "setComponentField"; key: string; field: ComponentDraftField; value: string }
  | { type: "addVulnerability" }
  | { type: "removeVulnerability"; key: string }
  | { type: "setVulnerabilityField"; key: string; field: VulnerabilityDraftField; value: string }
  | { type: "reset" }

export const initialCreateAssetFormState: CreateAssetFormState = {
  name: "",
  description: "",
  components: [],
  vulnerabilities: [],
}

function emptyComponentDraft(key: string): ComponentDraft {
  return { key, name: "", version: "", vendor: "", type: "" }
}

export function createAssetFormReducer(
  state: CreateAssetFormState,
  action: CreateAssetFormAction
): CreateAssetFormState {
  switch (action.type) {
    case "addComponent":
      return { ...state, components: [...state.components, emptyComponentDraft(crypto.randomUUID())] }
    case "removeComponent":
      return { ...state, components: state.components.filter((component) => component.key !== action.key) }
    default:
      return state
  }
}

export function useCreateAssetForm() {
  const [state, dispatch] = useReducer(createAssetFormReducer, initialCreateAssetFormState)

  return {
    state,
    addComponent: () => dispatch({ type: "addComponent" }),
  }
}
