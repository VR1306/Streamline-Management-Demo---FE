/* eslint-disable react-hooks/set-state-in-effect */
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
import { ControlledInput } from "@/src/components/controlledInput";
import Tabs, { TabItem } from "@/src/components/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface OrganizationOption {
  label: string;
  value: string;
}

interface selectOption {
  label: string;
  value: string;
}

export interface FormValues {
  organization: OrganizationOption | null;
  moduleType: selectOption | null;
  token?:string;
}

const ClientHome = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("eline-performance");
  const [socketData, setSocketData] = useState<RealtimePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);
  const tabParam = searchParams.get('tab');
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
      moduleType: {
        label: "Streamline Management",
        value: "streamline-management",
      },
      token:""
    },
  });

  const tabs: TabItem[] = [
    {
      id: 'peformanceReport',
      label: "Performance Report"
    },
    {
      id: 'performanceJobs',
      label: 'Performance Jobs',
    },
  ]
  type TabKey = (typeof tabs)[number]['id'];

  const defaultTab = tabs.length > 0 ? (tabs[0].id as TabKey) : null;

    const performanceActiveTab = (
    tabs.some((tab) => tab.id === tabParam) ? tabParam : defaultTab
  ) as TabKey | null;

  const { control } = formMethods;

  const router = useRouter()

  const organizationSelected = useWatch({
    control,
    name: "organization",
  });

  const moduleTypeValue = useWatch({
    control,
    name: "moduleType",
  });

  const selectedModule = useMemo(() => {
    return navLinks.find((item) => item.key === activeTab);
  }, [activeTab, navLinks]);

   const isStreamLineModule = useMemo(()=>{
    return moduleTypeValue?.value === "streamline-management"
  },[moduleTypeValue?.value])

  const filteredNavLinks = useMemo(() => {
    if (moduleTypeValue?.value === "streamline-management") {
      return navLinks;
    } else {
      return [
        ...navLinks,
        {
          label: "Service Regions",
          key: "serviceRegions",
          subTitle: "ext.pathway.serviceRegions",
        },
        {
          label: "Hotspots",
          key: "hotspots",
          subTitle: "ext.pathway.hotspots",
        },
      ];
    }
  }, [navLinks, moduleTypeValue]);



  useEffect(()=>{
    if(moduleTypeValue?.value){
      setActiveTab("eline-performance")
    }
  },[moduleTypeValue?.value])

  // Show a loader whenever the module type changes so the UI
  // has time to re-render the new nav links before content appears.
  useEffect(() => {
    setModuleLoading(true);
    const timer = setTimeout(() => setModuleLoading(false), 0);
    return () => clearTimeout(timer);
  }, [moduleTypeValue?.value]);

  // Socket subscription — only runs in streamline-management mode.
  useEffect(() => {
    if (!organizationSelected?.value) {
      setSocketData(null);
      setLoading(false);
      return;
    }

    // On-demand mode: skip socket entirely.
    if (moduleTypeValue?.value !== "streamline-management") {
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
      console.warn("No channel configured for selected combination");
      return;
    }

    // Reset old data and start loader.
    setSocketData(null);
    setLoading(true);

    mockSocket.subscribe(channelId, (data) => {
      console.log("SOCKET DATA:", data);
      setSocketData(data);
      setLoading(false);
    });

    return () => {
      mockSocket.unsubscribe();
    };
  }, [
    organizationSelected?.value,
    organizationSelected?.label,
    activeTab,
    moduleTypeValue?.value,
  ]);

    const handleTabChange = (tab: TabKey) => {
    if (tab === defaultTab) {
      router.push(`?tab=${defaultTab}`);
    } else {
      router.push(`?tab=${tab}`);
    }
  };


  return (
    <section>
      <Navbar
        logo="Streaming Management"
        links={filteredNavLinks}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        control={control}
        formMethods={formMethods}
      />

      <FormProvider {...formMethods}>
        <form className={`px-5 w-full ${isStreamLineModule ? "md:w-2/4" : "md:w-3/4"} flex flex-col md:flex-row items-center gap-5 justify-center my-5`}>
          <CommonSelect
            label="Organization"
            control={control}
            name="organization"
            placeholder="Select Organization"
            options={[
              {
                label: "Pathway Portal Synthetic Organization NCBCC-1",
                value: "36ef3d8a-400e-4c46-b1b7-2729162b47c4",
              },
              {
                label: "Pathway Portal Synthetic Organization NCBCC-2",
                value: "c3d4e5f6-90d4-44ab-8d8c-3191266300fa",
              },
              {
                label: "Pathway Portal Synthetic Organization NCBCC-4-1-1",
                value: "b8c9d0e1-1528-435e-b5af-5f67d8b64d3f",
              },
            ]}
            containerClassName="w-full"
          />
          {!isStreamLineModule && <ControlledInput
              type="text"
              name="token"
              label={"Token"}
              placeholder={"Enter Token"}
              containerClassName="w-full"
              isCustomBorder="border border-gray-300"
            />}
        </form>
      </FormProvider>

     {!isStreamLineModule && <div className="px-5 rounded-md">
        <Tabs
          tabs={tabs.map((tab) => ({
                  id: tab.id,
                  translationKey: tab.label,
                }))}
          activeTab={performanceActiveTab??""}
          onChange={handleTabChange}
          tabMinWidth="120px"
          isStretchedMobile={true}
          isFitContentMobile={false}
        />
      </div>}

      {/* Module type switching loader — shown while nav links re-render */}
      {moduleLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      ) : (
        <>
          {!organizationSelected && (
            <div className="flex flex-col items-center justify-center w-full h-[60vh]">
              <Image src={Images.noData} alt="No Data" loading="lazy" width={200} height={200}/>
              <label className="text-xs md:text-lg">
                Please select an organization to view the metrics
              </label>
            </div>
          )}

          {organizationSelected && loading && (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          )}

          {isStreamLineModule && organizationSelected && !loading && (
            <div className="p-6">
              {activeTab === "eline-performance" && (
                <Performance
                  organization={organizationSelected}
                  socketData={socketData}
                  selectedModule={selectedModule?.subTitle ?? ""}
                />
              )}

              {activeTab === "eline-traffic" && (
                <TrafficAnalysisClient
                  organization={organizationSelected}
                  socketData={socketData}
                  selectedModule={selectedModule?.subTitle ?? ""}
                />
              )}

              {activeTab === "ut-performance" && (
                <UTPerformance
                  organization={organizationSelected}
                  socketData={socketData}
                  selectedModule={selectedModule?.subTitle ?? ""}
                />
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ClientHome;