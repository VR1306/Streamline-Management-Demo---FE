import CopyPayloadCard from "@/src/components/copyPayloadCard";
import { RealtimePayload } from "@/src/helpers/mockSocket";

interface Props {
  organization: {
    label: string;
    value: string;
  } | null;
  socketData: RealtimePayload | null;
  selectedModule:string
}

const formatDate = (timestamp?: string) => {
  if (!timestamp) return "--";

  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timestamp?: string) => {
  if (!timestamp) return "--";

  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const Performance = ({ organization, socketData,selectedModule }: Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Performance Metrics
        </h1>

        <p className="mt-2 text-gray-600">
          {organization?.label} - {selectedModule}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Current Metric Value
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {socketData?.value ?? "--"}
          </h2>
        </div> */}

        {/* Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Connection Status
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

            <span className="font-semibold text-green-700">
              Live
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Last Updated
          </p>

          <div className="mt-3">
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(socketData?.timestamp)}
            </div>

            <div className="text-sm text-gray-500">
              {formatTime(socketData?.timestamp)}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Live Event Details
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Organization Name
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {organization?.label ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Organization ID
            </p>

            <p className="mt-1 break-all font-medium text-gray-900">
              {organization?.value ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Channel ID
            </p>

            <p className="mt-1 break-all font-medium text-gray-900">
              {socketData?.channelId ?? "--"}
            </p>
          </div>

          {/* <div>
            <p className="text-sm text-gray-500">
              Metric Value
            </p>

            <p className="mt-1 font-semibold text-blue-600">
              {socketData?.value ?? "--"}
            </p>
          </div> */}
        </div>
      </div>

      {/* Raw Payload */}
      <CopyPayloadCard data={socketData} />
    </div>
  );
};

export default Performance;