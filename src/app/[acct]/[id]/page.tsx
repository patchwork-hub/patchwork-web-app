"use client";

import { Context } from "@/components/organisms/status/Context";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function StatusDetailPage({
  params,
}: {
  params: Promise<{ id: string; acct: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") ?? "";
  const { data } = useVerifyAuthToken({
    enabled: true,
  });

  return data ? (
    <Context id={id} currentAcct={data?.acct} domain={domain} />
  ) : null;
}
