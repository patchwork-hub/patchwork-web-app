import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetChannelFilterOutKeyword,
  useGetChannelPostsType,
  useGetMutedContributorList,
  useGetMyTotalChannelList,
} from "@/hooks/queries/useChannelContent";
import { useChangeChannelPostsType } from "@/hooks/mutations/profile/useChannelContent";
import FilterChannelContentPage from "@/components/pages/settings/FilterChannelContentPage";
import AllProviders from "@/tests/AllProviders";

vi.mock("@/hooks/queries/useChannelContent", () => ({
  useGetMyTotalChannelList: vi.fn(),
  useGetMutedContributorList: vi.fn(),
  useGetChannelFilterOutKeyword: vi.fn(),
  useGetChannelPostsType: vi.fn(),
}));

vi.mock("@/hooks/mutations/profile/useChannelContent", () => ({
  useChangeChannelPostsType: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
  useRemoveOrUpdateFilterKeyword: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
  updateChannelContentTypeCache: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/components/organisms/settings/ContributorDialog", () => ({
  default: vi.fn(() => <div>ContributorDialog</div>),
}));

vi.mock("@/components/organisms/settings/FilterOutKeywordDialog", () => ({
  default: vi.fn(() => <div>FilterOutKeywordDialog</div>),
}));

const queryClient = new QueryClient();

describe("FilterChannelContentPage", () => {
  const mockChannels = [{ id: "channel-1", name: "Test Channel" }];
  const mockContributors = [
    { id: "user-1", name: "User One", handle: "user1" },
    { id: "user-2", name: "User Two", handle: "user2" },
  ];
  const mockKeywords = [
    { id: "keyword-1", keyword: "test", isHashtag: false },
    { id: "keyword-2", keyword: "example", isHashtag: true },
  ];
  const mockPostsType = { posts: true, reposts: false, replies: true };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGetMyTotalChannelList).mockReturnValue({
      data: mockChannels,
      isLoading: false,
    } as any);

    vi.mocked(useGetMutedContributorList).mockReturnValue({
      data: mockContributors,
      isLoading: false,
    } as any);

    vi.mocked(useGetChannelFilterOutKeyword).mockReturnValue({
      data: mockKeywords,
      isLoading: false,
    } as any);

    vi.mocked(useGetChannelPostsType).mockReturnValue({
      data: mockPostsType,
      isLoading: false,
    } as any);

    vi.mocked(useChangeChannelPostsType).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    } as any);
  });

  const renderComponent = () => {
    return render(
      <AllProviders>
        <FilterChannelContentPage />
      </AllProviders>
    );
  };

  it("renders the header and main sections", () => {
    renderComponent();

    expect(screen.getByText("Filter channel content")).toBeInTheDocument();
    expect(screen.getByText("Filter content")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Filter content from the wider network to ensure you channel stays relevant."
      )
    ).toBeInTheDocument();
  });

  it("displays the posts type filter section with checkboxes", () => {
    renderComponent();

    const postsCheckbox = screen.getByTestId("posts-checkbox");
    const repostsCheckbox = screen.getByTestId("reposts-checkbox");
    const repliesCheckbox = screen.getByTestId("reply-checkbox");

    expect(postsCheckbox).toBeChecked();
    expect(repostsCheckbox).not.toBeChecked();
    expect(repliesCheckbox).toBeChecked();
  });

  it("calls mutate when a posts type checkbox is clicked", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useChangeChannelPostsType).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    } as any);

    renderComponent();

    const repostsCheckbox = screen.getByTestId("reposts-checkbox");
    fireEvent.click(repostsCheckbox);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        channelId: "channel-1",
        posts: true,
        reposts: true,
        replies: true,
      });
    });
  });

  it("displays muted contributors section", async () => {
    renderComponent();

    const section = await screen.findByTestId("muted-contributors-section");
    expect(section).toBeInTheDocument();
  });

  it("opens the contributor dialog when add button is clicked", () => {
    renderComponent();

    const addButton = screen.getAllByText("Add another")[0];
    fireEvent.click(addButton);

    expect(screen.getByText("ContributorDialog")).toBeInTheDocument();
  });

  it("displays loading state for contributors", () => {
    vi.mocked(useGetMutedContributorList).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderComponent();

    expect(screen.getAllByTestId("skeleton-loader").length).toBeGreaterThan(0);
  });

  it("displays the mute keywords section", () => {
    renderComponent();

    expect(screen.getByText("Mute keywords")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add keyword filters to prevent posts from the wider network which contain this keyword from appearing in the channel."
      )
    ).toBeInTheDocument();

    mockKeywords.forEach((keyword) => {
      expect(screen.getByText(keyword.keyword)).toBeInTheDocument();
    });

    expect(screen.getAllByText("Add another")).toHaveLength(2);
  });

  it("opens the keyword dialog when add button is clicked", () => {
    renderComponent();

    const addButtons = screen.getAllByText("Add another");
    fireEvent.click(addButtons[1]);

    expect(screen.getByText("FilterOutKeywordDialog")).toBeInTheDocument();
  });

  it("shows empty states when no data is available", () => {
    vi.mocked(useGetMutedContributorList).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    vi.mocked(useGetChannelFilterOutKeyword).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderComponent();

    expect(
      screen.getByText("* You have not added any contributors to this channel.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("* You have not added any keyword to this channel yet.")
    ).toBeInTheDocument();
  });
});
