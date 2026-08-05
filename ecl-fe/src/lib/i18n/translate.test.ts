import { translate } from "./translate"

const DICT = {
  greeting: "Hello",
  welcome: "Welcome, {name}!",
  range: "{from} to {to}",
}

describe("translate", () => {
  it("returns the value for a known key", () => {
    expect(translate(DICT, "greeting")).toBe("Hello")
  })

  it("falls back to the key itself when the key is missing", () => {
    expect(translate(DICT, "nope")).toBe("nope")
  })

  it("interpolates a variable", () => {
    expect(translate(DICT, "welcome", { name: "Ana" })).toBe("Welcome, Ana!")
  })

  it("interpolates multiple variables", () => {
    expect(translate(DICT, "range", { from: "1", to: "10" })).toBe("1 to 10")
  })

  it("leaves unknown placeholders literal", () => {
    expect(translate(DICT, "welcome", {})).toBe("Welcome, {name}!")
  })

  it("passes templates through untouched when no vars are given", () => {
    expect(translate(DICT, "greeting")).toBe("Hello")
  })
})
