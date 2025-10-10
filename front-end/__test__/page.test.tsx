import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index"; // Import your page component
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/services/store";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      basePath: "",
      pathname: "/",
      route: "/",
      asPath: "/",
      query: {},
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      // ... add other properties you use
    };
  },
}));

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <Provider store={store}>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Provider>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
