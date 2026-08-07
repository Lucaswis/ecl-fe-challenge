import { useReducer } from "react"

import type { ComponentDraft, CreateAssetFormState, VulnerabilityDraft } from "@/lib/assets/types"

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

function emptyVulnerabilityDraft(key: string): VulnerabilityDraft {
  return { key, description: "", severity: "LOW" }
}

export function createAssetFormReducer(
  state: CreateAssetFormState,
  action: CreateAssetFormAction
): CreateAssetFormState {
  switch (action.type) {
    case "setField":
      return { ...state, [action.field]: action.value }
    case "reset":
      return initialCreateAssetFormState
    case "addComponent":
      return { ...state, components: [...state.components, emptyComponentDraft(crypto.randomUUID())] }
    case "removeComponent":
      return { ...state, components: state.components.filter((component) => component.key !== action.key) }
    case "setComponentField":
      return {
        ...state,
        components: state.components.map((component) =>
          component.key === action.key ? { ...component, [action.field]: action.value } : component
        ),
      }
    case "addVulnerability":
      return {
        ...state,
        vulnerabilities: [...state.vulnerabilities, emptyVulnerabilityDraft(crypto.randomUUID())],
      }
    case "removeVulnerability":
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.filter((vulnerability) => vulnerability.key !== action.key),
      }
    case "setVulnerabilityField":
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.map((vulnerability) =>
          vulnerability.key === action.key
            ? { ...vulnerability, [action.field]: action.value }
            : vulnerability
        ),
      }
  }
}

export function useCreateAssetForm() {
  const [state, dispatch] = useReducer(createAssetFormReducer, initialCreateAssetFormState)

  return {
    state,
    setField: (field: "name" | "description", value: string) => dispatch({ type: "setField", field, value }),
    addComponent: () => dispatch({ type: "addComponent" }),
    removeComponent: (key: string) => dispatch({ type: "removeComponent", key }),
    setComponentField: (key: string, field: ComponentDraftField, value: string) =>
      dispatch({ type: "setComponentField", key, field, value }),
    addVulnerability: () => dispatch({ type: "addVulnerability" }),
    removeVulnerability: (key: string) => dispatch({ type: "removeVulnerability", key }),
    setVulnerabilityField: (key: string, field: VulnerabilityDraftField, value: string) =>
      dispatch({ type: "setVulnerabilityField", key, field, value }),
    reset: () => dispatch({ type: "reset" }),
  }
}
