import { TrackingScreen } from "@/components/tracking/TrackingScreen";

export default async function TrackingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const invoiceParam = sp.invoiceNo;
  const invoiceNo = Array.isArray(invoiceParam) ? invoiceParam[0] : invoiceParam;

  return <TrackingScreen invoiceNo={invoiceNo ?? null} />;
}

