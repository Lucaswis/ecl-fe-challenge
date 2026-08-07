import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { useAssetStore } from "@/components/asset-store-context"
import { LocalAssetDetailFallback } from "./LocalAssetDetailFallback"
import type { LocalAsset } from "@/lib/assets/types"

jest.mock("../asset-store-context", () => {
  const actual = jest.requireActual("../asset-store-context")
  return { ...actual, useAssetStore: jest.fn() }
})

const mockUseAssetStore = useAssetStore as jest.MockedFunction<typeof useAssetStore>

const LOCAL_ASSET: LocalAsset = {
  id: "local-42",
  name: "Local Test Asset",
  description: "Created via the local store",
  createdAt: "2025-04-01T00:00:00Z",
  lastScan: "2025-04-01T00:00:00Z",
  components: [
    {
      id: "local-comp-1",
      name: "nginx",
      version: "1.25.3",
      vendor: "F5",
      type: "web-server",
      createdAt: "2025-04-01T00:00:00Z",
      lastScan: "2025-04-01T00:00:00Z",
      assetId: "local-42",
    },
  ],
  vulnerabilities: [{ id: "local-vuln-1", description: "Weak cipher suite", severity: "CRITICAL" }],
}

function storeReturning(getLocalAsset: (id: string) => LocalAsset | undefined) {
  return {
    created: [],
    deletedIds: new Set<string>(),
    addAsset: jest.fn(),
    deleteAsset: jest.fn(),
    getLocalAsset,
  }
}

describe("LocalAssetDetailFallback", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("renders the local asset through the same detail components used for real assets", () => {
    mockUseAssetStore.mockReturnValue(
      storeReturning((id) => (id === LOCAL_ASSET.id ? LOCAL_ASSET : undefined))
    )

    renderWithLocale(<LocalAssetDetailFallback id={LOCAL_ASSET.id} />)

    expect(screen.getByRole("heading", { name: "Local Test Asset" })).toBeInTheDocument()
    expect(screen.getByText("Created via the local store")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "nginx" })).toBeInTheDocument()
    expect(screen.getByText("Weak cipher suite")).toBeInTheDocument()
  })

  it("throws the NEXT_HTTP_ERROR_FALLBACK;404 digest when the id isn't in the local store either", () => {
    mockUseAssetStore.mockReturnValue(storeReturning(() => undefined))

    let thrown: unknown
    try {
      renderWithLocale(<LocalAssetDetailFallback id="does-not-exist" />)
    } catch (error) {
      thrown = error
    }

    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error & { digest?: string }).digest).toBe("NEXT_HTTP_ERROR_FALLBACK;404")
  })
})
