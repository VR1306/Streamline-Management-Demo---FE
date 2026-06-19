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

const UTPerformance = ({
  organization,
  socketData,
  selectedModule
}: Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          UT Performance Metrics
        </h1>

        <p className="mt-2 text-gray-600">
          {organization?.label} - {selectedModule} 
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            UT Metric Value
          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-600">
            {socketData?.value ?? "--"}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Stream Status
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            <span className="font-semibold text-green-700">
              Live
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Last Updated Date
          </p>

          <p className="mt-3 text-lg font-semibold text-gray-900">
            {formatDate(socketData?.timestamp)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Last Updated Time
          </p>

          <p className="mt-3 text-lg font-semibold text-gray-900">
            {formatTime(socketData?.timestamp)}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            UT Performance Details
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

          <div>
            <p className="text-sm text-gray-500">
              UT Performance Score
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-600">
              {socketData?.value ?? "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Raw Payload */}
      <CopyPayloadCard data={socketData} />

    </div>
  );
};

export default UTPerformance;