import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  useGetMyTotalChannelList,
  useGetContributorList,
  useGetChannelHashtagList,
  useGetChannelFilterKeyword,
  useGetChannelContentType,
} from "@/hooks/queries/useChannelContent";

import AddChannelContentPage from "@/components/pages/settings/AddChannelContentPage";
import AllProviders from "@/tests/AllProviders";

// Define ChannelList type (adjust based on actual type)

// Mock dependencies
vi.mock("@/hooks/queries/useChannelContent", () => ({
  useGetMyTotalChannelList: vi.fn(),
  useGetContributorList: vi.fn(),
  useGetChannelHashtagList: vi.fn(),
  useGetChannelFilterKeyword: vi.fn(),
  useGetChannelContentType: vi.fn(),
}));

vi.mock("@/components/atoms/common/ThemeText", () => ({
  ThemeText: ({ children, variant }) => (
    <span className={variant}>{children}</span>
  ),
}));

vi.mock("@/components/organisms/profile/ContentTypeSwitch", () => ({
  default: ({ isSwitchOn, label }) => (
    <div
      data-testid={`content-type-switch-${label
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {label}: {isSwitchOn ? "On" : "Off"}
    </div>
  ),
}));

vi.mock("@/components/organisms/settings/HorizontalItemRenderer", () => ({
  default: ({ data, renderItem }) => (
    <div data-testid="horizontal-item-renderer">
      {data.map((item, idx) => (
        <div key={idx}>{renderItem(item)}</div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/organisms/settings/ContributorProfile", () => ({
  default: ({ account }) => (
    <div data-testid="contributor-profile">{account.name}</div>
  ),
}));

vi.mock("@/components/organisms/settings/Hashtag", () => ({
  default: ({ hashtag }) => (
    <div data-testid="hashtag-item">{hashtag.name}</div>
  ),
}));

vi.mock("@/components/organisms/settings/FilterKeywordItem", () => ({
  default: ({ keyword }) => (
    <div data-testid="keyword-item">{keyword.name}</div>
  ),
}));

vi.mock("@/components/organisms/settings/ContributorDialog", () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="contributor-dialog">
        Contributor Dialog
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("@/components/organisms/settings/SearchHashtagDialog", () => ({
  default: ({ isOpen, onClose }) => (
    <div
      data-testid="hashtag-dialog"
      style={{ display: isOpen ? "block" : "none" }}
    >
      Hashtag Dialog
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("@/components/organisms/settings/FilterInKeywordDialog", () => ({
  default: ({ isOpen, onClose }) => (
    <div
      data-testid="keyword-dialog"
      style={{ display: isOpen ? "block" : "none" }}
    >
      Keyword Dialog
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("lucide-react", () => ({
  Loader2: () => <span data-testid="loader">Loading...</span>,
  ChevronLeft: () => <span data-testid="chevron-left">ChevronLeft</span>,
  // Add other icons as needed
}));

describe("AddChannelContentPage", () => {
  beforeEach(() => {
    vi.mocked(useGetMyTotalChannelList).mockReturnValue({
      data: [{ id: "123", name: "Test Channel" }],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);

    vi.mocked(useGetContributorList).mockReturnValue({
      data: [
        { id: "1", name: "Contributor 1" },
        { id: "2", name: "Contributor 2" },
      ],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);

    vi.mocked(useGetChannelHashtagList).mockReturnValue({
      data: [
        { id: "h1", name: "#Tag1" },
        { id: "h2", name: "#Tag2" },
      ],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);

    vi.mocked(useGetChannelFilterKeyword).mockReturnValue({
      data: [
        { id: "k1", name: "Keyword1" },
        { id: "k2", name: "Keyword2" },
      ],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);

    vi.mocked(useGetChannelContentType).mockReturnValue({
      data: [{ attributes: { custom_condition: "or_condition" } }],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with header and content sections", () => {
    render(<AddChannelContentPage />, { wrapper: AllProviders });

    expect(screen.getByText("Add channel content")).toBeInTheDocument();
    expect(screen.getByText("Content type")).toBeInTheDocument();
    expect(
      screen.getByText("Add sources - contributors (2)")
    ).toBeInTheDocument();
    expect(screen.getByText("Channel hashtag")).toBeInTheDocument();
    expect(screen.getByText("Add label - keywords")).toBeInTheDocument();
  });

  it("opens contributor dialog when Add new contributor button is clicked", () => {
    render(<AddChannelContentPage />, { wrapper: AllProviders });

    const addButton = screen.getByRole("button", {
      name: /Add new contributor/i,
    });
    fireEvent.click(addButton);

    expect(screen.getByTestId("contributor-dialog")).toBeInTheDocument();
    expect(screen.getByText("Contributor Dialog")).toBeInTheDocument();
  });

  it("closes contributor dialog when Close button is clicked", () => {
    render(<AddChannelContentPage />, { wrapper: AllProviders });

    const addButton = screen.getByRole("button", {
      name: /Add new contributor/i,
    });
    fireEvent.click(addButton);

    const closeButton = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("contributor-dialog")).not.toBeInTheDocument();
  });

  it("opens hashtag dialog when Add another button is clicked for andConnection", () => {
    vi.mocked(useGetChannelContentType).mockReturnValue({
      data: [{ attributes: { custom_condition: "and_condition" } }],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetching: false,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      failureReason: null,
    } as any);

    render(<AddChannelContentPage />, { wrapper: AllProviders });
    const addButton = screen.getByTestId("add-hashtag-button");
    fireEvent.click(addButton);

    expect(screen.getByTestId("hashtag-dialog")).toBeInTheDocument();
    expect(screen.getByText("Hashtag Dialog")).toBeInTheDocument();
  });
  it("opens keyword dialog when Add another button is clicked", () => {
    render(<AddChannelContentPage />, { wrapper: AllProviders });

    const addButton = screen.getByRole("button", { name: /Add another/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId("keyword-dialog")).toBeInTheDocument();
    expect(screen.getByText("Keyword Dialog")).toBeInTheDocument();
  });
});
