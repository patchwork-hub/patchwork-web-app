import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGetNewsmastChannelList } from "@/hooks/queries/useNewsmastChannel.query";

import { useSetPrimaryChannel } from "@/hooks/queries/useSetPrimary.query";
import {
  useFavouriteCommunityChannel,
  useUnFavouriteCommunityChannel,
} from "@/hooks/mutations/community/useToggleFavouriteChannel";
import { toast } from "sonner";
import DiscoverCommunitiesLayout from "@/app/discover-communities/page";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";

vi.mock("@/hooks/queries/useNewsmastChannel.query");
vi.mock("@/hooks/auth/useSearchInstance");
vi.mock("@/hooks/queries/useSetPrimary.query");
vi.mock("@/hooks/mutations/community/useToggleFavouriteChannel");
vi.mock("sonner");
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/atoms/common/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/atoms/common/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("DiscoverCommunitiesLayout", () => {
  const mockChannels = [
    {
      id: "1",
      attributes: {
        name: "Channel 1",
        slug: "channel-1",
        avatar_image_url: "http://example.com/image1.jpg",
        favourited_count: 100,
        is_primary: true,
        favourited: true,
      },
    },
    {
      id: "2",
      attributes: {
        name: "Channel 2",
        slug: "channel-2",
        avatar_image_url: "http://example.com/image2.jpg",
        favourited_count: 200,
        is_primary: false,
        favourited: false,
      },
    },
  ];

  const mockServerInfo = {
    thumbnail: {
      url: "http://example.com/banner.jpg",
    },
  };

  const mockSetPrimary = vi.fn();
  const mockFavorite = vi.fn();
  const mockUnfavorite = vi.fn();

  beforeEach(() => {
    vi.mocked(useGetNewsmastChannelList).mockReturnValue({
      data: mockChannels,
      isLoading: false,
    } as any);

    vi.mocked(useSearchServerInstance).mockReturnValue({
      data: mockServerInfo,
      isLoading: false,
    } as any);

    vi.mocked(useSetPrimaryChannel).mockReturnValue({
      mutate: mockSetPrimary,
    } as any);

    vi.mocked(useFavouriteCommunityChannel).mockReturnValue({
      mutate: mockFavorite,
    } as any);

    vi.mocked(useUnFavouriteCommunityChannel).mockReturnValue({
      mutate: mockUnfavorite,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with header and banner", () => {
    render(<DiscoverCommunitiesLayout />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByAltText("banner image")).toHaveAttribute(
      "src",
      mockServerInfo.thumbnail.url
    );
  });

  it("displays loading spinner when data is loading", () => {
    vi.mocked(useGetNewsmastChannelList).mockReturnValue({
      data: null,
      isLoading: true,
    } as any);
    render(<DiscoverCommunitiesLayout />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders the list of channels correctly", () => {
    render(<DiscoverCommunitiesLayout />);

    expect(screen.getByText("Discover communities")).toBeInTheDocument();
    expect(
      screen.getByText("Tap the plus icon to add channels to my communities")
    ).toBeInTheDocument();

    mockChannels.forEach((channel) => {
      expect(screen.getByText(channel.attributes.name)).toBeInTheDocument();
      expect(
        screen.getByText(`${channel.attributes.favourited_count} followers`)
      ).toBeInTheDocument();
    });
  });

  it("handles setting primary channel", () => {
    const mockSetPrimary = vi.fn();
    vi.mocked(useSetPrimaryChannel).mockReturnValue({
      mutate: mockSetPrimary,
    } as any);

    vi.mock("@/store/auth/activeDomain", () => ({
      useSelectedDomain: () => process.env.NEXT_PUBLIC_API_URL,
    }));

    render(<DiscoverCommunitiesLayout />);

    const channel2 = mockChannels[1];
    const setPrimaryButton = screen.getByTestId(
      `set-primary-${channel2.attributes.slug}`
    );
    fireEvent.click(setPrimaryButton);

    expect(mockSetPrimary).toHaveBeenCalledWith(
      {
        id: channel2.attributes.slug,
        instance_domain: process.env.NEXT_PUBLIC_API_URL,
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });
  it("handles favoriting a channel", () => {
    const mockFavorite = vi.fn();
    vi.mocked(useFavouriteCommunityChannel).mockReturnValue({
      mutate: mockFavorite,
    } as any);

    render(<DiscoverCommunitiesLayout />);

    const channel2 = mockChannels[1];
    const addButton = screen.getByTestId(
      `add-favorite-${channel2.attributes.slug}`
    );
    fireEvent.click(addButton);

    expect(mockFavorite).toHaveBeenCalledWith({
      id: channel2.attributes.slug,
      instance_domain: process.env.NEXT_PUBLIC_API_URL,
    });
  });
  it("handles unfavoriting a channel", async () => {
    //
    const mockChannels = [
      {
        id: "1",
        attributes: {
          name: "Channel 1",
          slug: "channel-1",
          favourited: true,
        },
      },
      ...Array(5)
        .fill(0)
        .map((_, i) => ({
          id: `${i + 2}`,
          attributes: {
            name: `Channel ${i + 2}`,
            slug: `channel-${i + 2}`,
            favourited: true,
          },
        })),
    ];

    vi.mocked(useGetNewsmastChannelList).mockReturnValue({
      data: mockChannels,
      isLoading: false,
    } as any);

    const mockUnfavorite = vi.fn();
    vi.mocked(useUnFavouriteCommunityChannel).mockReturnValue({
      mutate: mockUnfavorite,
    } as any);

    render(<DiscoverCommunitiesLayout />);

    const removeButton = screen.getByTestId("remove-favorite-channel-1");
    fireEvent.click(removeButton);

    expect(mockUnfavorite).toHaveBeenCalledWith({
      id: "channel-1",
      instance_domain: process.env.NEXT_PUBLIC_API_URL,
    });
  });

  it("shows error toast when trying to unfavorite with less than 6 channels", () => {
    vi.mocked(useGetNewsmastChannelList).mockReturnValue({
      data: mockChannels.slice(0, 1),
      isLoading: false,
    } as any);

    render(<DiscoverCommunitiesLayout />);

    const addedButton = screen.getByRole("button", { name: /added/i });
    fireEvent.click(addedButton);

    expect(toast.error).toHaveBeenCalledWith(
      "You must keep at least 5 favourite channels."
    );
    expect(mockUnfavorite).not.toHaveBeenCalled();
  });
});
