export interface RealtimePayload {
  channelId: string;
  orgName: string;
  page: string;
  value: number;
  timestamp: string;
}

export type SocketCallback = (
  data: RealtimePayload
) => void;

class MockSocket {
  private intervalId: NodeJS.Timeout | null = null;

  subscribe(
    channelId: string,
    callback: SocketCallback
  ): void {
    this.unsubscribe();

    console.log(`Subscribed to ${channelId}`);

    this.intervalId = setInterval(() => {
      callback({
        channelId,
        orgName: this.getOrg(channelId),
        page: this.getPage(channelId),
        value: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  }

  unsubscribe(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;

      console.log("Socket unsubscribed");
    }
  }

  private getOrg(channelId: string): string {
    const orgMap: Record<string, string> = {
      ch_001: "NCBCC-1",
      ch_002: "NCBCC-1",
      ch_003: "NCBCC-1",

      ch_004: "NCBCC-2",
      ch_005: "NCBCC-2",
      ch_006: "NCBCC-2",

      ch_007: "NCBCC-4-1-1",
      ch_008: "NCBCC-4-1-1",
      ch_009: "NCBCC-4-1-1",
    };

    return orgMap[channelId] ?? "Unknown";
  }

  private getPage(channelId: string): string {
    const pageMap: Record<string, string> = {
      ch_001: "E-Line Performance",
      ch_002: "E-Line Traffic",
      ch_003: "UT Performance",

      ch_004: "E-Line Performance",
      ch_005: "E-Line Traffic",
      ch_006: "UT Performance",

      ch_007: "E-Line Performance",
      ch_008: "E-Line Traffic",
      ch_009: "UT Performance",
    };

    return pageMap[channelId] ?? "Unknown";
  }
}

export const mockSocket = new MockSocket();