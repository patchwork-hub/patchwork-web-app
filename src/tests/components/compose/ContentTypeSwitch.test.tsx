import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { toast } from "sonner";
import ContentTypeSwitch from "@/components/organisms/profile/ContentTypeSwitch";
import { useChangeChannelContentType } from "@/hooks/mutations/profile/useChannelContent";

// Mock the hooks and toast
vi.mock("@/hooks/mutations/profile/useChannelContent", () => ({
  useChangeChannelContentType: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  updateChannelContentTypeCache: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("ContentTypeSwitch", () => {
  const defaultProps = {
    isSwitchOn: false,
    channelId: "test-channel-123",
    label: "Test Label",
    type: "open" as const,
  };

  it("renders correctly with provided props", () => {
    render(<ContentTypeSwitch {...defaultProps} />);

    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders with switch in correct state", () => {
    const { rerender } = render(<ContentTypeSwitch {...defaultProps} />);
    expect(screen.getByRole("switch")).not.toBeChecked();

    rerender(<ContentTypeSwitch {...defaultProps} isSwitchOn={true} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("calls mutate function with correct parameters when switch is toggled (open type)", () => {
    const mutate = vi.fn();
    vi.mocked(useChangeChannelContentType).mockReturnValueOnce({
      mutate,
    } as unknown as ReturnType<typeof useChangeChannelContentType>);

    render(<ContentTypeSwitch {...defaultProps} />);
    fireEvent.click(screen.getByRole("switch"));

    expect(mutate).toHaveBeenCalledWith({
      channel_type: "custom_channel",
      custom_condition: "or_condition",
      patchwork_community_id: "test-channel-123",
    });
  });

  it("calls mutate function with correct parameters when switch is toggled (selected type)", () => {
    const mutate = vi.fn();
    vi.mocked(useChangeChannelContentType).mockReturnValueOnce({
      mutate,
    } as unknown as ReturnType<typeof useChangeChannelContentType>);

    render(<ContentTypeSwitch {...defaultProps} type="selected" />);
    fireEvent.click(screen.getByRole("switch"));

    expect(mutate).toHaveBeenCalledWith({
      channel_type: "custom_channel",
      custom_condition: "and_condition",
      patchwork_community_id: "test-channel-123",
    });
  });
});
