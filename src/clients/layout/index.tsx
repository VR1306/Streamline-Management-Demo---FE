"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar, { NavItem } from "@/src/components/navbar";

import Performance from "../performance";
import TrafficAnalysisClient from "../trafficAnalysis";
import UTPerformance from "../utPerformance";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { CommonSelect } from "@/src/components/commonSelect";
import Image from "next/image";
import { Images } from "@/src/images";
import { CHANNEL_MAP } from "@/src/constants";
import { mockSocket, RealtimePayload } from "@/src/helpers/mockSocket";

interface OrganizationOption {
  label: string;
  value: string;
}

interface FormValues {
  organization: OrganizationOption | null;
}

const ClientHome = () => {
  const [activeTab, setActiveTab] = useState<string>("eline-performance");
  const [socketData, setSocketData] =
    useState<RealtimePayload | null>(null);

  const [loading, setLoading] = useState(false);

  const navLinks: NavItem[] = useMemo(
    () => [
      {
        label: "E-Line Performance Metrics",
        key: "eline-performance",
        subTitle: "ext.pathway.eline.perf",
      },
      {
        label: "E-Line Traffic Analysis",
        key: "eline-traffic",
        subTitle: "ext.pathway.eline.traffic",
      },
      {
        label: "UT Performance Metrics",
        key: "ut-performance",
        subTitle: "ext.pathway.ut.perf",
      },
    ],
    []
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      organization: null,
    },
  });

  const { control } = formMethods;

  const organizationSelected = useWatch({
    control,
    name: "organization",
  });

  const selectedModule = useMemo(() => {
    return navLinks.find((item) => item.key === activeTab);
  }, [activeTab, navLinks]);

  useEffect(() => {
    if (!organizationSelected?.value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocketData(null);
      setLoading(false);
      return;
    }

    const channelId =
      CHANNEL_MAP[
      organizationSelected.value as keyof typeof CHANNEL_MAP
      ]?.[
      activeTab as keyof (typeof CHANNEL_MAP)[keyof typeof CHANNEL_MAP]
      ];

    console.log("SUBSCRIBE REQUEST", {
      organization: organizationSelected.label,
      organizationId: organizationSelected.value,
      activeTab,
      channelId,
    });

    if (!channelId) {
      console.warn(
        "No channel configured for selected combination"
      );
      return;
    }

    // Reset old data and start loader
    setSocketData(null);
    setLoading(true);

    mockSocket.subscribe(channelId, (data) => {
      console.log("SOCKET DATA:", data);

      setSocketData(data);

      // Stop loader on first payload
      setLoading(false);
    });

    return () => {
      mockSocket.unsubscribe();
    };
  }, [
    organizationSelected?.value,
    organizationSelected?.label,
    activeTab,
  ]);

  return (
    <section>
      <Navbar
        logo="Streaming Management"
        links={navLinks}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* {selectedModule?.subTitle && (
        <span className="h-5 my-5 flex items-center px-5 w-full text-black text-normal md:text-lg font-semibold">
          Topic Name :
          <span className="font-normal mx-2">
            {selectedModule?.subTitle}
          </span>
        </span>
      )} */}

      <FormProvider {...formMethods}>
        <form className="px-5 w-full md:w-2/4 flex items-center justify-center my-5">
          <CommonSelect
            label="Organization"
            control={control}
            name="organization"
            placeholder="Select Organization"
            options={[
              {
                label:
                  "Pathway Portal Synthetic Organization NCBCC-1",
                value:
                  "36ef3d8a-400e-4c46-b1b7-2729162b47c4",
              },
              {
                label:
                  "Pathway Portal Synthetic Organization NCBCC-2",
                value:
                  "c3d4e5f6-90d4-44ab-8d8c-3191266300fa",
              },
              {
                label:
                  "Pathway Portal Synthetic Organization NCBCC-4-1-1",
                value:
                  "b8c9d0e1-1528-435e-b5af-5f67d8b64d3f",
              },
            ]}
          />
        </form>
      </FormProvider>

      {!organizationSelected && (
        <div className="flex flex-col items-center justify-center w-full h-[60vh]">
          <Image src={Images.noData} alt="No Data" loading="lazy"/>
          <label className="text-sm md:text-lg">
            Please select an organization to view the metrics
          </label>
        </div>
      )}

      {organizationSelected && loading && (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">
            Loading data...
          </p>
        </div>
      )}

      {organizationSelected && !loading && (
        <div className="p-6">
          {activeTab === "eline-performance" && (
            <Performance
              organization={organizationSelected}
              socketData={socketData}
              selectedModule={selectedModule?.subTitle??""}
            />
          )}

          {activeTab === "eline-traffic" && (
            <TrafficAnalysisClient
              organization={organizationSelected}
              socketData={socketData}
              selectedModule={selectedModule?.subTitle??""}
            />
          )}

          {activeTab === "ut-performance" && (
            <UTPerformance
              organization={organizationSelected}
              socketData={socketData}
              selectedModule={selectedModule?.subTitle??""}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default ClientHome;