import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Status, AccountRelationship } from "../../../types/status";
import userEvent from "@testing-library/user-event";
import {
  BlockAction,
  BookmarkAction,
  BoostAction,
  DeleteAction,
  FavouriteAction,
  FollowAction,
  MuteAction,
  ReplyAction,
  ReportAction,
  StatusActions,
} from "@/components/organisms/status/StatusActions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "@/components/organisms/modal/modal.context";

const mockFavouriteMutation = vi.fn();
const mockUnfavouriteMutation = vi.fn();
const mockBoostMutation = vi.fn();
const mockUnboostMutation = vi.fn();
const mockBookmarkMutation = vi.fn();
const mockUnbookmarkMutation = vi.fn();
const mockDeleteMutation = vi.fn();
const mockMuteMutation = vi.fn();
const mockUnmuteMutation = vi.fn();
const mockBlockMutation = vi.fn();
const mockUnblockMutation = vi.fn();
const mockFollowMutation = vi.fn();
const mockUnfollowMutation = vi.fn();

vi.mock("@/lib/auth/useLoggedIn", () => ({ default: () => true }));

vi.mock("@/hooks/mutations/status/useFavouriteStatus", () => ({
  useFavouriteStatus: () => ({ mutate: mockFavouriteMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnfavouriteStatus", () => ({
  useUnfavouriteStatus: () => ({ mutate: mockUnfavouriteMutation }),
}));
vi.mock("@/hooks/mutations/status/useBoostStatus", () => ({
  useBoostStatus: () => ({ mutate: mockBoostMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnboostStatus", () => ({
  useUnboostStatus: () => ({ mutate: mockUnboostMutation }),
}));
vi.mock("@/hooks/mutations/status/useBookmarkStatus", () => ({
  useBookmarkStatus: () => ({ mutate: mockBookmarkMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnbookmarkStatus", () => ({
  useUnbookmarkStatus: () => ({ mutate: mockUnbookmarkMutation }),
}));
vi.mock("@/hooks/mutations/status/useDeleteStatus", () => ({
  useDeleteStatus: () => ({ mutate: mockDeleteMutation }),
}));
vi.mock("@/hooks/mutations/status/useMuteAccount", () => ({
  useMuteAccount: () => ({ mutate: mockMuteMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnmuteAccount", () => ({
  useUnmuteAccount: () => ({ mutate: mockUnmuteMutation }),
}));
vi.mock("@/hooks/mutations/status/useBlockAccount", () => ({
  useBlockAccount: () => ({ mutate: mockBlockMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnblockAccount", () => ({
  useUnblockAccount: () => ({ mutate: mockUnblockMutation }),
}));
vi.mock("@/hooks/mutations/status/useFollowAccount", () => ({
  useFollowAccount: () => ({ mutate: mockFollowMutation }),
}));
vi.mock("@/hooks/mutations/status/useUnfollowAccount", () => ({
  useUnfollowAccount: () => ({ mutate: mockUnfollowMutation }),
}));

let isLoggedIn = true;
vi.mock("@/lib/auth/useLoggedIn", () => ({
  default: () => isLoggedIn,
}));

const mockOpenModal = vi.fn();
vi.mock("../modal/modal.context", () => ({
  useModalAction: () => ({ openModal: mockOpenModal }),
}));

const mockOpenReportDialog = vi.fn();
vi.mock("@/stores/reportDialogStore", () => ({
  useReportDialogStore: () => mockOpenReportDialog,
}));

vi.mock("@/providers/localeProvider", () => ({
  useLocale: () => ({ t: (key: string) => key }),
}));

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  share: vi.fn().mockResolvedValue(undefined),
});

vi.mock("@/components/organisms/status/LoginDialog", () => ({
  default: ({
    action, 
    actionType,
    openDialog,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setOpenDialog,
    ...restProps 
  }: { 
    action: string; 
    actionType?: string;
    openDialog?: boolean;
    setOpenDialog?: () => void;
    [key: string]: unknown;
  }) => (
    <div data-testid="login-dialog" {...restProps}>
      {action}
      {actionType && <span data-testid="action-type">{actionType}</span>}
      {openDialog && <span data-testid="open-dialog">{openDialog.toString()}</span>}
    </div>
  ),
}));
vi.mock("./Status", () => ({
  default: () => <div data-testid="status-preview">Status Preview</div>,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, 
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ModalProvider>{ui}</ModalProvider>
    </QueryClientProvider>
  );
};

const mockStatus: Status = {
  id: "101",
  account: { id: "user1", acct: "user@domain.com", username: "user" },
  url: "https://example.com/status/101",
  favourited: false,
  reblogged: false,
  bookmarked: false,
  favourites_count: 10,
  reblogs_count: 5,
  replies_count: 2,
  content: "This is a test status",
  visibility: "public",
  reblog: null,
} as unknown as Status;

const mockRelationship: AccountRelationship[] = [
  {
    id: "user1",
    following: false,
    showing_reblogs: false,
    notifying: false,
    followed_by: false,
    blocking: false,
    blocked_by: false,
    muting: false,
    muting_notifications: false,
    requested: false,
    domain_blocking: false,
    endorsed: false,
  },
];

describe("StatusActions Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isLoggedIn = true;
  });

  describe("StatusActions (Main Component)", () => {
    it("renders core actions for a status", () => {
      renderWithProviders(
        <StatusActions status={mockStatus} deleteId="101" editId="101" />
      );
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /bookmark/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /more options/i })
      ).toBeInTheDocument();
    });

    it("shows edit and delete actions for own status", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <StatusActions
          status={mockStatus}
          deleteId="101"
          editId="101"
          ownStatus
          showEdit
        />
      );

      await user.click(screen.getByRole("button", { name: /more options/i }));

      expect(await screen.findByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("shows follow, mute, block, and report actions for other's status", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <StatusActions
          status={mockStatus}
          deleteId="101"
          editId="101"
          ownStatus={false}
        />
      );

      await user.click(screen.getByRole("button", { name: /more options/i }));

      expect(await screen.findByText("timeline.follow")).toBeInTheDocument();
      expect(screen.getByText("timeline.mute")).toBeInTheDocument();
      expect(screen.getByText("timeline.block")).toBeInTheDocument();
      expect(screen.getByText("timeline.report")).toBeInTheDocument();
    });

    it("renders LoginDialog trigger instead of Popover when logged out", () => {
      isLoggedIn = false;
      renderWithProviders(
        <StatusActions status={mockStatus} deleteId="101" editId="101" />
      );
      const loginDialogs = screen.getAllByTestId("login-dialog");
      expect(loginDialogs.length).toBeGreaterThan(0);

      expect(
        screen.queryByRole("button", { name: /more options/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("FavouriteAction", () => {
    it("calls favourite mutation when clicked", () => {
      render(<FavouriteAction status={mockStatus} differentOrigin={false} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockFavouriteMutation).toHaveBeenCalledWith({
        id: "101",
        differentOrigin: false,
        url: mockStatus.url,
      });
    });

    it("calls unfavourite mutation when status is already favourited", () => {
      const favouritedStatus = { ...mockStatus, favourited: true };
      render(
        <FavouriteAction status={favouritedStatus} differentOrigin={false} />
      );
      fireEvent.click(screen.getByRole("button"));
      expect(mockUnfavouriteMutation).toHaveBeenCalledWith({
        id: "101",
        differentOrigin: false,
        url: mockStatus.url,
      });
    });

    it("renders LoginDialog trigger when logged out", () => {
      isLoggedIn = false;
      render(<FavouriteAction status={mockStatus} differentOrigin={false} />);
      expect(screen.getByTestId("login-dialog")).toBeInTheDocument();
    });
  });

  describe("BoostAction", () => {
    it("calls boost mutation when clicked", () => {
      render(<BoostAction status={mockStatus} differentOrigin={false} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockBoostMutation).toHaveBeenCalled();
    });
  });

  describe("BookmarkAction", () => {
    it("calls bookmark mutation when clicked", () => {
      render(<BookmarkAction status={mockStatus} differentOrigin={false} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockBookmarkMutation).toHaveBeenCalled();
    });

    it("calls unbookmark mutation when status is already bookmarked", () => {
      const bookmarkedStatus = { ...mockStatus, bookmarked: true };
      render(
        <BookmarkAction status={bookmarkedStatus} differentOrigin={false} />
      );
      fireEvent.click(screen.getByRole("button"));
      expect(mockUnbookmarkMutation).toHaveBeenCalled();
    });
  });

  describe("ReplyAction", () => {
    it("renders as a link to the status page when logged in", () => {
      render(<ReplyAction status={mockStatus} differentOrigin={false} />);
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        `/@${mockStatus.account.acct}/${mockStatus.id}`
      );
    });

    it("renders LoginDialog when logged out", () => {
      isLoggedIn = false;
      render(<ReplyAction status={mockStatus} differentOrigin={false} />);
      expect(screen.getByTestId("login-dialog")).toBeInTheDocument();
    });
  });

  describe("DeleteAction", () => {
    it("opens a confirmation dialog and calls delete mutation", async () => {
      render(<DeleteAction deleteId="101" />);
      fireEvent.click(screen.getByRole("button", { name: /delete/i }));

      expect(await screen.findByText("Confirm delete")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockDeleteMutation).toHaveBeenCalledWith({
        id: "101",
        deleteMedia: true,
      });
    });
  });

  describe("MuteAction", () => {
    it("opens mute confirmation dialog and calls mute mutation", async () => {
      render(
        <MuteAction status={mockStatus} relationship={mockRelationship} />
      );
      fireEvent.click(screen.getByRole("button", { name: /timeline.mute/i }));

      expect(await screen.findByText("confirm_mute")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "timeline.mute" }));

      expect(mockMuteMutation).toHaveBeenCalledWith({ id: "user1" });
    });

    it("calls unmute mutation directly if already muted", () => {
      const mutedRelationship = [{ ...mockRelationship[0], muting: true }];
      render(
        <MuteAction status={mockStatus} relationship={mutedRelationship} />
      );
      fireEvent.click(screen.getByRole("button", { name: /common.unmute/i }));
      expect(mockUnmuteMutation).toHaveBeenCalledWith("user1");
    });
  });

  describe("BlockAction", () => {
    it("opens block confirmation and calls block mutation", async () => {
      render(<BlockAction accountId="user1" relationship={mockRelationship} />);
      fireEvent.click(screen.getByRole("button", { name: /timeline.block/i }));

      expect(await screen.findByText("confirm_block")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "timeline.block" }));

      expect(mockBlockMutation).toHaveBeenCalledWith("user1");
    });

    it("calls unblock mutation if already blocking", () => {
      const blockingRelationship = [{ ...mockRelationship[0], blocking: true }];
      render(
        <BlockAction accountId="user1" relationship={blockingRelationship} />
      );
      fireEvent.click(screen.getByRole("button", { name: /common.unblock/i }));
      expect(mockUnblockMutation).toHaveBeenCalledWith("user1");
    });
  });

  describe("FollowAction", () => {
    it("calls follow mutation", () => {
      render(
        <FollowAction accountId="user1" relationship={mockRelationship} />
      );
      fireEvent.click(screen.getByRole("button"));
      expect(mockFollowMutation).toHaveBeenCalledWith("user1");
    });

    it("calls unfollow mutation if already following", () => {
      const followingRelationship = [
        { ...mockRelationship[0], following: true },
      ];
      render(
        <FollowAction accountId="user1" relationship={followingRelationship} />
      );
      fireEvent.click(screen.getByRole("button"));
      expect(mockUnfollowMutation).toHaveBeenCalledWith("user1");
    });

    it("opens LoginDialog if logged out", () => {
      isLoggedIn = false;
      render(
        <FollowAction
          asButton
          accountId="user1"
          relationship={mockRelationship}
        />
      );
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId("login-dialog")).toBeInTheDocument();
    });
  });

  describe("ReportAction", () => {
    it("calls the report dialog store action", () => {
      render(<ReportAction status={mockStatus} />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockOpenReportDialog).toHaveBeenCalledWith({
        status: mockStatus,
        account: undefined,
      });
    });
  });
});
